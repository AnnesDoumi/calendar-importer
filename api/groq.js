// api/groq.js

const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { text } = req.body;
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "user", content: text },
                ],
                model: "mixtral-8x7b-32768",
            });

            res.status(200).json({ completion });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
