
async function listModels() {
    const apiKey = 'AIzaSyAPsKeaRDI06MhtCWzNMRQvUDffzFvKWww';
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log("Image Generation Models:");
        if (data.models) {
            data.models.forEach(model => {
                // Check if it's an image model or supports image generation
                if (model.name.includes('image') || (model.supportedGenerationMethods && model.supportedGenerationMethods.some(m => m.includes('image')))) {
                    console.log(`- ${model.name}`);
                    console.log(`  Methods: ${model.supportedGenerationMethods.join(', ')}`);
                }
            });
        }
    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

listModels();
