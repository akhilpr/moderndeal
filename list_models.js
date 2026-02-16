import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function listModels() {
    try {
        const response = await ai.models.list();
        console.log("Available Models:");
        for (const model of response.models) {
            console.log(`- ${model.name} (Supported methods: ${model.supportedGenerationMethods?.join(', ')})`);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
