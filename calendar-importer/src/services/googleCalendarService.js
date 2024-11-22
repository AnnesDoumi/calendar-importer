// src/services/googleCalendarService.js
const { google } = require('googleapis');

// Funktion zum Importieren der Ereignisse in den Google Kalender
async function importCSVToGoogleCalendar(oAuth2Client, events) {
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    for (const event of events) {
        const eventBody = {
            summary: event.title,
            start: {
                dateTime: `${event.startDate}T${event.startTime}:00`,
                timeZone: 'Europe/Berlin' // Beispiel für Zeitzone; passe ggf. an
            },
            end: {
                dateTime: `${event.endDate}T${event.endTime}:00`,
                timeZone: 'Europe/Berlin'
            },
            description: event.description,
        };

        try {
            await calendar.events.insert({
                calendarId: 'primary',
                resource: eventBody,
            });
            console.log(`Event "${event.title}" added successfully.`);
        } catch (error) {
            console.error(`Failed to add event "${event.title}":`, error.message);
        }
    }
}

module.exports = { importCSVToGoogleCalendar };
