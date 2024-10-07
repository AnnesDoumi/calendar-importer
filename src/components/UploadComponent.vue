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
          <td><input v-model="entry.title" /></td>
          <td><input v-model="entry.startDate" /></td>
          <td><input v-model="entry.startTime" /></td>
          <td><input v-model="entry.endDate" /></td>
          <td><input v-model="entry.endTime" /></td>
          <td><input v-model="entry.location" /></td>
          <td><input v-model="entry.description" /></td>
        </tr>
        </tbody>
      </table>
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

        // Verwende Tesseract.js für die Texterkennung
        const file = this.files[0];
        const result = await Tesseract.recognize(file, "eng", {
          logger: (m) => console.log(m),
        });

        // Extrahiere den Text aus dem Bild
        const extractedText = result.data.text;
        console.log("Extracted text from image:", extractedText);

        // Erstelle den vollständigen Prompt, der an die Groq-API gesendet wird
        const completePrompt = `${prompt}: ${extractedText}`;
        console.log("Complete prompt:", completePrompt);

        // Sende den Text an deine serverseitige API (Groq-API-Handler)
        const apiResponse = await axios.post('/api/groq', {prompt: completePrompt});

        // Verarbeite die Antwort der API
        this.processApiResponse(apiResponse.data.completion);
      } catch (error) {
        console.error("Error analyzing file", error);
      }
    },

    processApiResponse(apiResponse) {
      if (!apiResponse) {
        console.error("API response is missing");
        return;
      }

      const extractedData = apiResponse.trim().split("\n");

      // Überprüfe, ob die Daten tatsächlich extrahiert wurden
      this.analysisData = extractedData.map((entry) => {
        // Stelle sicher, dass entry definiert ist und nicht leer
        if (entry && entry.trim()) {
          const [title, startDate, startTime, endDate, endTime, location, description] = entry.split(",");

          // Falls keine Daten für ein Feld vorhanden sind, setze es auf einen leeren String
          return {
            title: title ? title.trim() : '',
            startDate: startDate ? startDate.trim() : '',
            startTime: startTime ? startTime.trim() : '',
            endDate: endDate ? endDate.trim() : '',
            endTime: endTime ? endTime.trim() : '',
            location: location ? location.trim() : '',
            description: description ? description.trim() : '',
          };
        } else {
          // Gib eine leere Struktur zurück, falls `entry` nicht korrekt definiert ist
          return {
            title: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            location: '',
            description: '',
          };
        }
      });

      console.log("Processed Data:", this.analysisData);
    }

    ,
    generateCSV() {
      const csvContent = "Subject,Start Date,Start Time,End Date,End Time,Location,Description\n" +
          this.analysisData.map(event =>
              `${event.title},${event.startDate},${event.startTime},${event.endDate},${event.endTime},${event.location},${event.description}`
          ).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "calendar_events.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    }
    ,
    generateICS() {
      const icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//YourApp//NONSGML v1.0//EN\n" +
          this.analysisData.map(event =>
              `BEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${this.formatDateTime(event.startDate, event.startTime)}\nDTEND:${this.formatDateTime(event.endDate, event.endTime)}\nLOCATION:${event.location}\nDESCRIPTION:${event.description}\nEND:VEVENT\n`
          ).join("") +
          "END:VCALENDAR";

      const blob = new Blob([icsContent], { type: "text/calendar" });
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
      const prompt = "Analyze this text and create a CSV file for Google Calendar import.";
      this.analyzeFile(prompt);
    },

    importAppleCalendar() {
      const prompt = "Analyze this text and create an ICS file for Apple Calendar import.";
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
