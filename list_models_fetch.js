
async function listModels() {
    const apiKey = 'AIzaSyAPsKeaRDI06MhtCWzNMRQvUDffzFvKWww';
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(model => {
                console.log(`- ${model.name}`);
                if (model.supportedGenerationMethods) {
                    console.log(`  Methods: ${model.supportedGenerationMethods.join(', ')}`);
                }
            });
        } else {
            console.log("No models found or error in response:", data);
        }
    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

listModels();
