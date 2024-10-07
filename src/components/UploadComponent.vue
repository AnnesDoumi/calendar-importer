<template>
  <div id="app">
    <h1>Calendar Importer</h1>

    <div class="upload-section">
      <h2>Upload a file or take a photo</h2>

      <!-- Datei-Upload -->
      <input type="file" accept="image/*" @change="handleFileUpload" />

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
          <th>Date</th>
          <th>Time</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(entry, index) in analysisData" :key="index">
          <td><input v-model="entry.title" /></td>
          <td><input v-model="entry.date" /></td>
          <td><input v-model="entry.time" /></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
// Importiere den Google Prediction Service Client
const { PredictionServiceClient } = require('@google-cloud/aiplatform').v1;
import Tesseract from "tesseract.js";

// Initialisiere den PredictionServiceClient mit deinem Google Cloud-Schlüssel
const client = new PredictionServiceClient({
  keyFilename: 'config/google-cloud-key.json', // Pfad zur Google Cloud JSON-Schlüsseldatei
});

export default {
  data() {
    return {
      files: [], // Hochgeladene Dateien
      showCamera: false, // Steuert das Anzeigen des Kameramodals
      analysisData: [], // Speichert die analysierten Daten
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
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.$refs.video.srcObject = stream;
      });
    },

    // Schließt das Kamera-Modul
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



    // OCR-Logik zur Textextraktion und Weiterleitung an Google Gemini API
    async analyzeFile(prompt) {
      try {
        if (this.files.length === 0) {
          console.error("No files uploaded");
          return;
        }

        // Verwende Tesseract.js für OCR
        const file = this.files[0];
        const result = await Tesseract.recognize(file, "eng", {
          logger: (m) => console.log(m),
        });

        const extractedText = result.data.text;
        console.log("Extracted text from image:", extractedText);

        // Sende die Anfrage an Google Gemini und verarbeite die Antwort
        const apiResponse = await this.sendToGoogleGemini(
            `${prompt}: ${extractedText}`
        );
        this.processApiResponse(apiResponse);
      } catch (error) {
        console.error("Error analyzing file", error);
      }
    },

    // API-Aufruf an Google Gemini
    async sendToGoogleGemini(promptText) {
      try {
        const response = await client.predict({
          endpoint:
              'projects/YOUR_PROJECT_ID/locations/YOUR_LOCATION/publishers/YOUR_PUBLISHER_ID/models/YOUR_MODEL_ID', // Anpassen
          instances: [{ prompt: promptText }],
          parameters: { temperature: 0.7, maxOutputTokens: 1000 },
        });
        return response;
      } catch (error) {
        console.error("Error sending data to Google Gemini", error);
      }
    },

    // Verarbeite die Antwort von Google Gemini
    processApiResponse(apiResponse) {
      if (!apiResponse || !apiResponse.predictions) {
        console.error("API response is missing 'predictions'");
        return;
      }

      // Verarbeite die Antwort von Google Gemini
      const extractedData = apiResponse.predictions[0].output
          .trim()
          .split("\n");
      this.analysisData = extractedData.map((entry) => {
        const [title, date, time] = entry.split(","); // Passe die Struktur an
        return { title, date, time };
      });
      console.log("Processed Data:", this.analysisData);
    },

    // CSV generieren und zum Download bereitstellen
    generateCSV(analysisData) {
      const csvContent =
          "Subject,Start Date,Start Time,End Date,End Time\n" +
          analysisData
              .map(
                  (event) =>
                      `${event.title},${event.date},${event.time},${event.date},${event.time}`
              )
              .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "calendar_events.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    },

    // ICS-Datei generieren und zum Download bereitstellen
    generateICS(analysisData) {
      const icsContent =
          "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//YourApp//NONSGML v1.0//EN\n" +
          analysisData
              .map(
                  (event) =>
                      `BEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${this.formatDateTime(
                          event.date,
                          event.time
                      )}\nDTEND:${this.formatDateTime(
                          event.date,
                          event.time
                      )}\nEND:VEVENT\n`
              )
              .join("") +
          "END:VCALENDAR";

      const blob = new Blob([icsContent], { type: "text/calendar" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "calendar_events.ics";
      a.click();
      window.URL.revokeObjectURL(url);
    },

    formatDateTime(date, time) {
      // Formatierung von Datum und Zeit für ICS (z.B. "20221010T090000Z")
      return date.replace(/-/g, "") + "T" + time.replace(/:/g, "") + "00Z";
    },

    importGoogleCalendar() {
      const prompt =
          "Analyze this text and create a CSV file for Google Calendar import.";
      this.analyzeFile(prompt);
    },

    importAppleCalendar() {
      const prompt =
          "Analyze this text and create an ICS file for Apple Calendar import.";
      this.analyzeFile(prompt);
    },
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
