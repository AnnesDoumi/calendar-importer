// src/services/groqService.js
import Groq from "groq-sdk";

// Initialisiere die GROQ API mit dem API-Key aus der .env Datei
const groq = new Groq({ apiKey: process.env.VUE_APP_GROQ_API_KEY });

async function sendToGroq(promptText) {
    try {
        // Verwende den API-Call zur Modellgenerierung
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: promptText,  // Verwende den vom Benutzer eingegebenen Text
                },
            ],
            model: "mixtral-8x7b-32768",  // Beispielmodell, ändere es nach Bedarf
        });

        // Rückgabe des Inhalts der Antwort
        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error sending data to GROQ:", error);
        return null;
    }
}

export { sendToGroq };
