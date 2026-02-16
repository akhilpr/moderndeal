
import fs from 'fs';

async function listModels() {
    const apiKey = 'AIzaSyAPsKeaRDI06MhtCWzNMRQvUDffzFvKWww';
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        let output = "Available Models:\n";
        if (data.models) {
            data.models.forEach(model => {
                output += `- ${model.name}\n`;
                if (model.supportedGenerationMethods) {
                    output += `  Methods: ${model.supportedGenerationMethods.join(', ')}\n`;
                }
            });
        } else {
            output += JSON.stringify(data, null, 2);
        }
        fs.writeFileSync('all_models.txt', output);
        console.log("Wrote models to all_models.txt");

    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

listModels();
