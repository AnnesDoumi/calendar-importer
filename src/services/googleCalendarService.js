const { google } = require('googleapis');
const { OAuth2 } = google.auth;

// Set up the OAuth2 client with your credentials
const oAuth2Client = new OAuth2(
    process.env.VUE_APP_GOOGLE_CLIENT_ID,
    process.env.VUE_APP_GOOGLE_CLIENT_SECRET,
    "postmessage" // this will be the redirect URL when user logs in
);

// Function to get the Google Calendar API
function getGoogleCalendarAPI(token) {
    oAuth2Client.setCredentials(token);
    return google.calendar({ version: 'v3', auth: oAuth2Client });
}

// Function to import events from CSV data into Google Calendar
async function importCSVToGoogleCalendar(token, events) {
    const calendar = getGoogleCalendarAPI(token);

    for (const event of events) {
        const eventBody = {
            summary: event.title,
            start: {
                dateTime: `${event.startDate}T${event.startTime}:00`,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use user's timezone
            },
            end: {
                dateTime: `${event.endDate}T${event.endTime}:00`,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            description: event.description,
        };

        await calendar.events.insert({
            calendarId: 'primary', // default calendar
            resource: eventBody,
        });
    }
}

export { importCSVToGoogleCalendar };
