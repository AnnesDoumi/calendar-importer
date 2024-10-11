const Groq = require('groq-sdk');
require('dotenv').config(); // Umgebungsvariablen laden

// Initialisiere die GROQ API mit dem API-Key aus der .env-Datei
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { prompt } = req.body;
            if (!prompt) {
                return res.status(400).json({ error: "Missing 'prompt' in request body" });
            }

            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'mixtral-8x7b-32768',
            });

            res.status(200).json({ completion: completion.choices[0].message.content });
        } catch (error) {
            console.error('Error with Groq API:', error.message);
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
