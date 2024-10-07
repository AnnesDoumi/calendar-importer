// src/services/googleGeminiService.js

const { PredictionServiceClient } = require('@google-cloud/aiplatform').v1;

// Initialisiere den PredictionServiceClient mit deinem Google Cloud-Schlüssel
const client = new PredictionServiceClient({
    keyFilename: 'path/to/your-google-cloud-key.json', // Stelle sicher, dass der Pfad korrekt ist
});

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
        return null;  // Gib null zurück, um Fehler sicher zu behandeln
    }
}

module.exports = {
    sendToGoogleGemini,
};
