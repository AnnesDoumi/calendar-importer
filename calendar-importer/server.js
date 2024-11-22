const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const Groq = require("groq-sdk");
const { google } = require('googleapis');
require('dotenv').config({ path: '.env' });

const app = express();
const port = 3000;
const groq = new Groq({
    apiKey: process.env.VUE_APP_GROQ_API_KEY, // Die Umgebungsvariable sollte so gelesen werden
});
// Dynamische Basis-URL je nach Umgebung festlegen
const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://snapcalendar.io' // Produktions-URL mit HTTPS
    : 'http://localhost:3000';  // Lokale Entwicklungs-URL mit HTTP


// Die dynamische Redirect-URI basierend auf der Umgebung
const redirectUri = `${baseUrl}/auth/google/callback`;

// Initialisiere den OAuth2-Client mit dynamischer Redirect-URI
const oAuth2Client = new google.auth.OAuth2(
    process.env.VUE_APP_GOOGLE_CLIENT_ID,
    process.env.VUE_APP_GOOGLE_CLIENT_SECRET,
    redirectUri  // Nur redirectUri hier verwenden
);


// Session konfigurieren
app.use(session({
    secret: 'deinGeheimnis',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // In Produktion nur HTTPS
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Für localhost lax
    },
}));


app.use(bodyParser.json());

app.get('/auth/google', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar']
    });
    res.redirect(authUrl);
});

const frontendUrl = process.env.NODE_ENV === 'production'
    ? 'https://snapcalendar.io' // Produktions-Frontend
    : 'http://localhost:8080';  // Lokales Frontend

app.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        req.session.tokens = tokens;

        // Dynamische Weiterleitung basierend auf der Umgebung
        res.redirect(frontendUrl);
    } catch (error) {
        console.error('Error retrieving access token', error);
        res.status(500).send('Authentication failed');
    }
});



app.post('/api/google-calendar-import', async (req, res) => {
    if (!req.session.tokens) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    oAuth2Client.setCredentials(req.session.tokens);

    const { importCSVToGoogleCalendar } = require('./src/services/googleCalendarService');
    try {
        await importCSVToGoogleCalendar(oAuth2Client, req.body.events);
        res.status(200).json({ message: 'Events successfully imported to Google Calendar' });
    } catch (error) {
        console.error('Error importing to Google Calendar:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



/**
 * API-Endpunkt für den Empfang von OCR-extrahiertem Text und den Aufruf der GROQ-API
 */
app.post('/api/groq', async (req, res) => {
    try {
        const { prompt } = req.body;  // Erwartet "prompt" vom Client (extrahierter Text)
        console.log("GROQ_API_KEY:", process.env.VUE_APP_GROQ_API_KEY);

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
// Antwort an den Client, jetzt mit Struktur, die 'completion' direkt in data übergibt
        res.status(200).json({ completion: output });
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


const path = require('path');

app.use(express.static(path.join(__dirname, 'dist'))); // Falls du Vue im "dist"-Ordner hast

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
