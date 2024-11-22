const Groq = require('groq-sdk');
require('dotenv').config(); // Sicherstellen, dass Umgebungsvariablen geladen werden

// Der API-Schlüssel wird jetzt korrekt aus den Umgebungsvariablen gelesen
const groq = new Groq({
    apiKey: process.env.VUE_APP_GROQ_API_KEY,
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Extrahiere den Prompt aus dem Request Body
            const { prompt } = req.body;
            if (!prompt) {
                return res.status(400).json({ error: "Missing 'prompt' in request body" });
            }

            // Sende den Prompt an das Groq-Modell
            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'mixtral-8x7b-32768',  // Das Modell, das du verwenden möchtest
            });

            // API-Antwort an den Client zurücksenden
            res.status(200).json({ completion: completion.choices[0].message.content });
        } catch (error) {
            console.error('Error with Groq API:', error.message);

            // Fehler an den Client zurücksenden
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    } else {
        // Nur POST-Requests zulassen
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
