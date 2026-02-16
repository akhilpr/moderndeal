
import { Part } from "../types";

export const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const urlToGenerativePart = async (url: string, mimeType: string): Promise<Part> => {
    // Replaced the unreliable CORS proxy with a more robust canvas-based solution.
    // This function now draws the image to an in-memory canvas to extract its base64 data,
    // which avoids CORS issues that block direct fetch requests on the client-side.
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // This is crucial for security and canvas access.

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return reject(new Error('Could not get canvas context.'));
            }

            ctx.drawImage(img, 0, 0);
            
            // Get the full data URL and split to get just the base64 part.
            const dataUrl = canvas.toDataURL(mimeType);
            const base64Data = dataUrl.split(',')[1];

            if (!base64Data) {
                return reject(new Error('Failed to extract base64 data from the image.'));
            }

            resolve({
                inlineData: { data: base64Data, mimeType },
            });
        };

        img.onerror = () => {
            reject(new Error(`Failed to load image from URL: ${url}. The resource may be private or unavailable.`));
        };

        img.src = url;
    });
};
