const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Groq = require("groq-sdk");
const app = express();
const port = 3000;

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY, // Du musst sicherstellen, dass diese Umgebungsvariable gesetzt ist
});

app.use(bodyParser.json());

/**
 * API-Endpunkt für den Empfang von OCR-extrahiertem Text und den Aufruf der GROQ-API
 */
app.post('/api/extract-calendar-data', async (req, res) => {
    try {
        const { prompt } = req.body;  // Erwartet "prompt" vom Client (extrahierter Text)

        // Anfrage an GROQ API für Textbearbeitung
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "mixtral-8x7b-32768",
        });

        // Überprüfen, ob die Antwort gültig ist
        const output = completion.choices[0]?.message?.content || '';

        // Splitten der erhaltenen Daten (vorausgesetzt CSV-Struktur wurde vom KI-Modell zurückgegeben)
        const entries = output.split('\n').map(line => {
            const [title, date, time] = line.split(',');
            return { title, date, time };
        });

        // Antwort an den Client
        res.status(200).json({ entries });
    } catch (error) {
        console.error('Error while sending data to GROQ API:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpunkt zum Generieren einer CSV-Datei und ICS-Datei.
 */
app.post('/api/generate-files', (req, res) => {
    const { entries } = req.body;  // Erwartet die Kalender-Einträge vom Client

    // CSV-Datei generieren
    const csvContent = 'Subject,Start Date,Start Time,End Date,End Time\n' +
        entries.map(event => `${event.title},${event.date},${event.time},${event.date},${event.time}`).join('\n');

    fs.writeFileSync('calendar_events.csv', csvContent);

    // ICS-Datei generieren
    const icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//YourApp//NONSGML v1.0//EN\n' +
        entries.map(event =>
            `BEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${formatDateTime(event.date, event.time)}\nDTEND:${formatDateTime(event.date, event.time)}\nEND:VEVENT\n`
        ).join('') + 'END:VCALENDAR';

    fs.writeFileSync('calendar_events.ics', icsContent);

    res.status(200).json({ message: 'Files generated successfully.' });
});

// Hilfsfunktion zur Datumsformatierung für ICS-Dateien
function formatDateTime(date, time) {
    return date.replace(/-/g, '') + 'T' + time.replace(/:/g, '') + '00Z';
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


/** Google Calendar Endpunkt **/

// Importiere den Google Calendar Service
const { importCSVToGoogleCalendar } = require('./src/services/googleCalendarService');

// Endpunkt für den Import in den Google Kalender
app.post('/api/google-calendar-import', async (req, res) => {
    try {
        const { events } = req.body;
        const token = req.headers.authorization; // Google OAuth2 Token des Benutzers

        if (!token) {
            return res.status(401).json({ error: 'Authorization token missing' });
        }

        // Importiere die CSV-Daten in den Google Kalender
        await importCSVToGoogleCalendar(token, events);
        res.status(200).json({ message: 'Events successfully imported to Google Calendar' });
    } catch (error) {
        console.error('Error importing to Google Calendar:', error);
        res.status(500).json({ error: error.message });
    }
});
