async function sendToGroq(promptText) {
    try {
        const response = await fetch('/api/groq', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: promptText }),
        });

        if (!response.ok) {
            throw new Error('Failed to send request to Groq API');
        }

        const data = await response.json();
        return data.completion || '';
    } catch (error) {
        console.error('Error sending data to Groq:', error);
        return null;
    }
}

export { sendToGroq };
