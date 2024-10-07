// src/services/googleGeminiService.js

const { PredictionServiceClient } = require('@google-cloud/aiplatform').v1;

// Initialisiere den PredictionServiceClient mit deinem Google Cloud-Schlüssel aus der Umgebungsvariablen
const client = new PredictionServiceClient();

async function sendToGoogleGemini(promptText) {
    try {
        // Konfiguriere deinen Google Gemini API-Endpunkt
        const endpoint = 'projects/YOUR_PROJECT_ID/locations/YOUR_LOCATION/publishers/YOUR_PUBLISHER_ID/models/YOUR_MODEL_ID';

        // API-Anfrage an Google Gemini
        const [response] = await client.predict({
            endpoint,
            instances: [{ prompt: promptText }],
            parameters: { temperature: 0.7, maxOutputTokens: 1000 }
        });

        return response;
    } catch (error) {
        console.error('Error sending data to Google Gemini', error);
        return null;
    }
}

module.exports = {
    sendToGoogleGemini,
};
