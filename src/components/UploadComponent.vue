<template>
  <div id="app">
    <h1>Calendar Importer</h1>

    <div class="upload-section">
      <h2>Upload a file or take a photo</h2>

      <!-- Datei-Upload -->
      <input type="file" accept="image/*" @change="handleFileUpload"/>

      <!-- Kamera Foto aufnehmen -->
      <button @click="openCameraModal">Take Photo</button>

      <!-- Modal für die Kamera -->
      <div v-if="showCamera" class="modal">
        <div class="modal-content">
          <video ref="video" width="320" height="240" autoplay></video>
          <button @click="takePhoto">Capture Photo</button>
          <button @click="closeCameraModal">Close</button>
        </div>
      </div>

      <!-- Kalender Optionen -->
      <div class="calendar-buttons">
        <!-- Korrektes Aufrufen der Methode analyzeFile beim Klicken -->
        <button @click="importGoogleCalendar" class="google-button">
          Import to Google Calendar
        </button>
        <button @click="importAppleCalendar" class="apple-button">
          Import to Apple Calendar
        </button>
      </div>
    </div>

    <!-- Analyzierte Daten anzeigen -->
    <div v-if="analysisData.length > 0" class="data-table">
      <h2>Analyzed Data</h2>
      <table>
        <thead>
        <tr>
          <th>Title</th>
          <th>Start Date</th>
          <th>Start Time</th>
          <th>End Date</th>
          <th>End Time</th>
          <th>Location</th>
          <th>Description</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(entry, index) in analysisData" :key="index">
          <td><input v-model="entry.title"/></td>
          <td><input v-model="entry.startDate"/></td>
          <td><input v-model="entry.startTime"/></td>
          <td><input v-model="entry.endDate"/></td>
          <td><input v-model="entry.endTime"/></td>
          <td><input v-model="entry.location"/></td>
          <td><input v-model="entry.description"/></td>
        </tr>
        </tbody>
      </table>
      <div>
        <button @click="generateCSV(analysisData)">Export to Google Calendar CSV</button>
      </div>

    </div>
  </div>
</template>
<script>
import Tesseract from "tesseract.js";
import axios from 'axios';  // Korrekte Platzierung des axios Imports

export default {
  data() {
    return {
      files: [], // Dateien die hochgeladen oder fotografiert werden
      showCamera: false, // Steuert das Anzeigen des Kameramodals
      analysisData: [], // Ergebnis nach Texterkennung
    };
  },
  methods: {
    // Datei-Upload-Logik
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      this.files = files;
    },

    // Open Camera Modal
    openCameraModal() {
      this.showCamera = true;
      navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
        this.$refs.video.srcObject = stream;
      });
    },

    // Kamera schließen
    closeCameraModal() {
      this.showCamera = false;
      const video = this.$refs.video;
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    },

    // Methode zum Fotografieren
    takePhoto() {
      const canvas = document.createElement("canvas");
      const video = this.$refs.video;
      canvas.width = 320;
      canvas.height = 240;
      canvas.getContext("2d").drawImage(video, 0, 0, 320, 240);
      const dataURL = canvas.toDataURL("image/png");
      this.files.push(dataURL);
      this.closeCameraModal(); // Kamera schließen nach dem Foto
    },

    // Texterkennung mit Tesseract und Aufruf der API
    async analyzeFile(prompt) {
      try {
        if (this.files.length === 0) {
          console.error("No files uploaded");
          return;
        }

        const file = this.files[0];
        const result = await Tesseract.recognize(file, "eng", {
          logger: (m) => console.log(m),
        });

        let extractedText = result.data.text;
        console.log("Extracted text before cleaning:", extractedText);

        // Clean the extracted text to remove unwanted characters
        extractedText = this.cleanExtractedText(extractedText);
        console.log("Cleaned extracted text:", extractedText);

        // Send the cleaned text to the API
        const apiResponse = await axios.post('/api/groq', { prompt: `${prompt}: ${extractedText}` });

        console.log("API Full Response:", apiResponse);

        this.processApiResponse(apiResponse.data.completion);
      } catch (error) {
        console.error("Error analyzing file", error);
      }
    }
    ,

    processApiResponse(apiResponse) {
      if (!apiResponse) {
        console.error("API response is missing");
        return;
      }

      // Entferne die erste Zeile (Spaltennamen) aus der API-Antwort
      const rows = apiResponse.trim().split("\n");
      const dataWithoutHeaders = rows.slice(1); // Entferne die erste Zeile

      const cleanedData = dataWithoutHeaders.map(entry => {
        const [title, startDate, startTime, endDate, endTime, description] = entry.split(",");

        // Daten validieren und formatieren
        const formattedStartDate = this.formatDate(startDate);
        const formattedEndDate = this.formatDate(endDate || startDate); // Enddatum = Startdatum, falls nicht angegeben
        const formattedStartTime = this.formatTime(startTime);
        const formattedEndTime = this.formatTime(endTime);

        return {
          title: title || "No Title",
          startDate: formattedStartDate || "",
          startTime: formattedStartTime || "",
          endDate: formattedEndDate || "",
          endTime: formattedEndTime || "",
          location: "", // Leer lassen, da es von der API nicht geliefert wird
          description: description || ""
        };
      });

      this.analysisData = cleanedData;
    },


    formatDate(date) {
      // Logik, um das Datum in "YYYY-MM-DD" zu konvertieren
      const dateObj = new Date(date);
      return isNaN(dateObj) ? "" : dateObj.toISOString().split("T")[0];
    },

    formatTime(time) {
      if (!time) return "";  // Wenn die Zeit undefiniert ist, gib einen leeren String zurück
      const [hours, minutes] = time.split(":");  // Zeit in Stunden und Minuten aufteilen
      if (!hours || !minutes) return "";  // Wenn das Format nicht stimmt, gib ebenfalls einen leeren String zurück
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;  // Formatiere die Zeit richtig
    }


    ,
    generateCSV(analysisData) {
      const csvContent =
          "Subject,Start Date,Start Time,End Date,End Time,Description\n" +
          analysisData
              .map(event =>
                  `${event.title},${event.startDate},${event.startTime},${event.endDate},${event.endTime},${event.description}`
              )
              .join("\n");

      const blob = new Blob([csvContent], {type: "text/csv"});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "calendar_events.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    }
    ,

    cleanExtractedText(extractedText) {
      // Remove unwanted characters such as special symbols, stray brackets, and extra spaces
      return extractedText
          .replace(/[‘@[\]m]/g, '')  // Removes special characters
          .replace(/\s+/g, ' ')      // Collapses multiple spaces into one
          .trim();
    }
    ,

    generateICS() {
      const icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//YourApp//NONSGML v1.0//EN\n" +
          this.analysisData.map(event =>
              `BEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${this.formatDateTime(event.startDate, event.startTime)}\nDTEND:${this.formatDateTime(event.endDate, event.endTime)}\nLOCATION:${event.location}\nDESCRIPTION:${event.description}\nEND:VEVENT\n`
          ).join("") +
          "END:VCALENDAR";

      const blob = new Blob([icsContent], {type: "text/calendar"});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "calendar_events.ics";
      a.click();
      window.URL.revokeObjectURL(url);
    }

    ,


    // Methoden zum Import in Kalender (Google/Apple)
    importGoogleCalendar() {
      const prompt = `You are given  text extracted from OCR. Your task is to extract every entry exactly as it appears in the OCR and format it into a CSV structure compatible with Google Calendar. Ensure that no entry is left out, and provide output for every line in the OCR, even if some fields (like Start Time or End Date) are missing.

### Important Rules:
1. **Context reset**: Do not use any previous context or input. Treat this as a new and independent task. Ignore any information from previous prompts or interactions.
2. **No missing entries**: Every entry in the OCR must appear in the output, even if some fields are incomplete. Do not skip any lines or entries.
3. **Extract data exactly as it appears**: Extract each field exactly as it is in the OCR. Do not infer or guess any missing data. If a field is missing, leave it blank.
4. **Ensure correct formatting**:
   - Subject: If the role (e.g., "Barista") is missing or unclear, leave it blank.
   - Start Date and End Date: Format as YYYY-MM-DD. If missing, leave the field blank.
   - Start Time and End Time: Format as HH:MM. If missing, leave the field blank.
   - Description: Include any additional information such as shift details or remarks. If missing, leave blank.
5. **Handle missing fields correctly**: If any field is missing in the OCR text (e.g., Start Date or Start Time), make sure it is reflected as a blank field in the CSV output, but do not skip that entry.
6. **Do not modify the content**: Do not change, infer, or guess any information. Simply extract it as it appears.
7. **Session Reset**: After you have sent your response, do a session reset!


### Example Output Structure (for structure reference only, do not use this data):
Subject,Start Date,Start Time,End Date,End Time,Description
Barista,2024-10-31,15:00,2024-10-31,20:00,
Barista,2024-10-30,15:00,2024-10-30,20:00,
Montag,2024-10-21,06:24,2024-10-21,14:51,F

###  OCR Text:
`;

      this.analyzeFile(prompt);

    },

    importAppleCalendar() {
      const prompt = "<- Analyze this Data, extract it for a (.ics) apple calendar output, no addition information or commenting";
      this.analyzeFile(prompt);
    },

    exportToCSV() {
      // Google Calendar CSV-Spalten
      const header = [
        "Subject", "Start Date", "Start Time", "End Date", "End Time", "All Day Event", "Description", "Location", "Private"
      ];

      // Daten aus der Tabelle extrahieren und für CSV formatieren
      const csvRows = this.analysisData.map(event => {
        return [
          event.title || "",                    // Subject
          event.startDate || "",                // Start Date
          event.startTime || "",                // Start Time
          event.endDate || event.startDate || "", // End Date
          event.endTime || "",                  // End Time
          "False",                              // All Day Event
          event.description || "",              // Description
          event.location || "",                 // Location
          "False"                               // Private
        ].join(","); // Komma-getrennte Werte für CSV
      });

      // CSV-Zeilen generieren
      const csvContent = [
        header.join(","), // Kopfzeile
        ...csvRows        // Zeilen
      ].join("\n");

      // CSV-Datei erstellen und zum Download anbieten
      const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', 'calendar_events.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }


  },
};
</script>


<style scoped>
/* Globales Layout */
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 40px;
}

/* Upload-Sektion */
.upload-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

.google-button {
  background-color: #4285F4;
  color: white;
  border: none;
}

.apple-button {
  background-color: #000;
  color: white;
  border: none;
}

/* Modal für Kamera */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
}

input[type="file"] {
  display: block;
  margin: 10px auto;
}

.data-table {
  margin-top: 30px;
}

.data-table table {
  width: 100%;
  margin: 0 auto;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.data-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}
</style>
