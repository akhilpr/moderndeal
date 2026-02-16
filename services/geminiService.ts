
import { GoogleGenAI, GenerateContentResponse, Part as GenAIPart } from '@google/genai';
import { Part } from '../types';

/**
 * =======================================================================
 * IMPORTANT: API KEY NOTICE
 * =======================================================================
 * This service now makes REAL calls to the Google Gemini API.
 * It uses `process.env.API_KEY`, which must be configured in your
 * development environment. For production, this logic MUST be moved
 * to a secure backend to protect your API key.
 * =======================================================================
 */

// Initialize the Google AI client.
// This assumes the API_KEY is available as an environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateChatResponse = async (history: Part[][], newMessage: Part[]): Promise<string> => {
    const formattedHistory = history.map((turn, i) => ({
        role: i % 2 === 0 ? 'user' : 'model',
        parts: turn as GenAIPart[],
    }));

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: formattedHistory,
    });

    try {
        const response: GenerateContentResponse = await chat.sendMessage({ message: newMessage as GenAIPart[] });

        const text = response.text;
        if (!text) {
            throw new Error("No text response from AI.");
        }
        return text;
    } catch (error: any) {
        console.error("Gemini API Error (Chat):", error);

        let errorMessage = error.message || "Unknown error";

        // Check if the error message is a JSON string
        try {
            const errorObj = JSON.parse(errorMessage);
            if (errorObj.error) {
                if (errorObj.error.code === 429 || errorObj.error.status === 'RESOURCE_EXHAUSTED') {
                    throw new Error("I'm currently overloaded with requests. Please try again in a minute.");
                }
                errorMessage = errorObj.error.message || errorMessage;
            }
        } catch (e) {
            // Not a JSON string
        }

        if (errorMessage.includes("429") || errorMessage.includes("Quota exceeded") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
            throw new Error("I'm currently overloaded with requests. Please try again in a minute.");
        }

        throw new Error(errorMessage);
    }
};

export const generateImageInRoom = async (roomImage: Part, product: Part, prompt: string): Promise<string> => {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) throw new Error("OpenRouter API Key is missing.");

        const roomImageUrl = `data:${roomImage.inlineData?.mimeType};base64,${roomImage.inlineData?.data}`;
        const productImageUrl = `data:${product.inlineData?.mimeType};base64,${product.inlineData?.data}`;
        const finalPrompt = `Show this furniture product in a realistic living room setting: ${prompt}. Photorealistic, high quality.`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "model": "black-forest-labs/flux.2-klein-4b",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            { "type": "text", "text": finalPrompt },
                            { "type": "image_url", "image_url": { "url": roomImageUrl } },
                            { "type": "image_url", "image_url": { "url": productImageUrl } }
                        ]
                    }
                ],
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenRouter Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();

        // --- IMPROVED PARSING LOGIC ---

        // 1. Check for OpenRouter standard image generation response
        const imageUrl =
            data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (imageUrl) {
            return imageUrl;
        }
        console.log(data);

        // 3. Fallback: Parse markdown or raw URL from content
        const content = data.choices?.[0]?.message?.content;
        if (content) {
            const markdownMatch = content.match(/\((https?:\/\/.*?\.(?:png|jpg|jpeg|webp).*?)\)/);
            if (markdownMatch) return markdownMatch[1];
            if (content.trim().startsWith('http')) return content.trim();
        }

        console.error("Unrecognized Response Format:", data);
        throw new Error("AI did not return a valid image URL.");

    } catch (error: any) {
        console.error("OpenRouter API Error:", error);
        throw error;
    }
};

export async function generate3DPhotoVideo(base64Image: string, mimeType: string, aspectRatio: string): Promise<string> {
    const PROMPT = `
      Animate this photo with a subtle 3D parallax effect. 
      The camera should perform a slow, smooth dolly zoom or a gentle arc path to create a sense of depth and motion.
      The animation should be short, elegant, and loop seamlessly.
      Focus on bringing the subject to life without distorting the original image.
      The final video output should have an aspect ratio of ${aspectRatio}.
    `;

    try {
        // @ts-ignore - generateVideos might not be in the type definition yet
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: PROMPT,
            image: {
                imageBytes: base64Image,
                mimeType: mimeType,
            },
            config: {
                numberOfVideos: 1
            }
        });

        // Poll for the result
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before polling again
            // @ts-ignore
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = (operation as any).response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error("Video generation completed, but no download link was found.");
        }

        // Fetch the video data
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!videoResponse.ok) {
            const errorText = await videoResponse.text();
            console.error(`Failed to download video. Status: ${videoResponse.status} ${videoResponse.statusText}`, errorText);
            throw new Error(`Failed to download the generated video. Server responded with: ${videoResponse.statusText}`);
        }

        const videoBlob = await videoResponse.blob();
        return URL.createObjectURL(videoBlob);

    } catch (error: any) {
        console.error("Error in Gemini API call:", error);

        let detailedMessage = "An unknown error occurred during video generation.";

        if (error instanceof Error) {
            const errorMessage = error.message;
            let parsedError: any = null;

            try {
                const jsonStart = errorMessage.indexOf('{');
                if (jsonStart !== -1) {
                    const jsonSubstring = errorMessage.substring(jsonStart);
                    parsedError = JSON.parse(jsonSubstring);
                }
            } catch (e) {
                // Ignore parsing errors
            }

            if (parsedError?.error?.status === 'RESOURCE_EXHAUSTED' || parsedError?.error?.code === 429) {
                detailedMessage = "You've exceeded your API quota. Please check your plan and billing details.";
            } else if (parsedError?.error?.message) {
                detailedMessage = `API Error: ${parsedError.error.message}`;
            } else if (errorMessage.includes('429') || errorMessage.toUpperCase().includes('RESOURCE_EXHAUSTED')) {
                detailedMessage = "You've exceeded your API quota. Please check your plan and billing details.";
            } else {
                detailedMessage = errorMessage;
            }
        }

        throw new Error(detailedMessage);
    }
}
