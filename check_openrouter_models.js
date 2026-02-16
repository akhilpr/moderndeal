
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually load .env
const envPath = path.join(__dirname, '.env');

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim();
            envVars[key] = value;
        }
    });

    const apiKey = envVars.OPENROUTER_API_KEY;

    if (!apiKey) {
        console.error("OPENROUTER_API_KEY not found in .env");
        process.exit(1);
    }

    console.log("Using API Key starting with:", apiKey.substring(0, 10) + "...");

    // Use native fetch (Node 18+)
    async function listModels() {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/models", {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                }
            });

            if (!response.ok) {
                console.error(`Error: ${response.status} ${response.statusText}`);
                const text = await response.text();
                console.error(text);
                return;
            }

            const data = await response.json();

            fs.writeFileSync('openrouter_models.json', JSON.stringify(data.data, null, 2));
            console.log(`Saved ${data.data.length} models to openrouter_models.json`);

            // Look for valid image models for immediate feedback
            const imageModels = data.data.filter(m => {
                const id = m.id.toLowerCase();
                return id.includes('diffusion') || id.includes('image') || id.includes('flux') || id.includes('dall') || id.includes('mnic');
            });

            console.log("Total models found:", data.data.length);
            console.log("--- Potential Image Models (First 10) ---");
            imageModels.slice(0, 10).forEach(m => console.log(m.id));
        } catch (error) {
            console.error("Failed to fetch models:", error);
        }
    }

    listModels();

} catch (err) {
    console.error("Error reading .env or executing script:", err);
}
