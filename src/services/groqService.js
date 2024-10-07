import axios from 'axios';

async function sendToGroq(promptText) {
    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions', // Ersetze durch den tatsächlichen GROQ-Endpunkt
            {
                model: 'llama3-8b-8192', // Das Modell, das du verwenden möchtest
                prompt: promptText,
                temperature: 0.7,
                max_tokens: 1000
            },
            {
                headers: {
                    'Authorization': `Bearer YOUR_GROQ_API_KEY`, // Setze deinen API-Schlüssel ein
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error sending data to GROQ', error);
        return null;
    }
}

export { sendToGroq };
