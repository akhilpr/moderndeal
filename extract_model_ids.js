import fs from 'fs';

try {
    const data = JSON.parse(fs.readFileSync('openrouter_models.json', 'utf8'));
    const imageGenModels = data.filter(m => {
        return m.architecture?.output_modalities?.includes('image');
    });

    console.log(`Found ${imageGenModels.length} image generation models.`);
    console.log("--- Image Generation Models ---");
    imageGenModels.forEach(m => console.log(m.id));
} catch (e) {
    console.error(e);
}
