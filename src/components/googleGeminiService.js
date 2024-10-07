// src/services/googleGeminiService.js
import axios from 'axios';

async function sendToGoogleGemini(promptText) {
    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBofgOF_zsANFPi-gjBB19pyQbx1bn1zPY', // Ersetze dies durch den korrekten Google Gemini API-Endpunkt
            {
                prompt: promptText,
                temperature: 0.7,
                max_tokens: 1000
            },
            {
                headers: {
                    Authorization: `Bearer YOUR_GOOGLE_GEMINI_API_KEY`, // Verwende deinen API-Schlüssel hier
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error sending data to Google Gemini', error);
        return null;  // Gib null zurück, um Fehler sicher zu behandeln
    }
}

export { sendToGoogleGemini };
