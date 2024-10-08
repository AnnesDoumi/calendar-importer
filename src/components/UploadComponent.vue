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
        <!-- Google Calendar Import -->
        <button @click="importGoogleCalendar" class="google-button">
          Import to Google Calendar
        </button>
        <!-- Apple Calendar Import -->
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
        <tr v-for="(entry, index) in analysisData" :key="index" @mouseover="entry.showDelete = true" @mouseleave="entry.showDelete = false">
          <td>
            <div class="row">
              <button v-if="entry.showDelete" class="delete-button" @click="removeRow(index)">-</button>
              <input v-model="entry.title" class="centered-input" />
            </div>
          </td>
          <td><input v-model="entry.startDate" /></td>
          <td><input v-model="entry.startTime" /></td>
          <td><input v-model="entry.endDate" /></td>
          <td><input v-model="entry.endTime" /></td>
          <td><input v-model="entry.location" /></td>
          <td><input v-model="entry.description" /></td>
        </tr>
        </tbody>
      </table>
      <div>
        <button @click="generateCSV(analysisData)">Export to Google Calendar CSV</button>
      </div>

      <!-- Add Row Button -->
      <button class="add-button" @click="addRow">+</button>
    </div>
  </div>
</template>

<script>
import Tesseract from "tesseract.js";
import axios from "axios";

export default {
  data() {
    return {
      files: [], // Hochgeladene Dateien
      showCamera: false, // Steuert die Anzeige des Kameramodals
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

        // Bereinigen des extrahierten Textes
        extractedText = this.cleanExtractedText(extractedText);
        console.log("Cleaned extracted text:", extractedText);

        // API-Aufruf mit bereinigtem Text
        const apiResponse = await axios.post("/api/groq", {prompt: `${prompt}: ${extractedText}`});

        console.log("API Full Response:", apiResponse);

        this.processApiResponse(apiResponse.data.completion);
      } catch (error) {
        console.error("Error analyzing file", error);
      }
    },

    // API Response verarbeiten
    processApiResponse(apiResponse) {
      if (!apiResponse) {
        console.error("API response is missing");
        return;
      }

      this.analysisData = [];

      // Entferne die erste Zeile (Spaltennamen) aus der API-Antwort
      const rows = apiResponse.trim().split("\n");
      const dataWithoutHeaders = rows.slice(1); // Entferne die Header-Zeile

      const cleanedData = dataWithoutHeaders
          .filter(entry => {
            const entryFields = entry.split(",");
            const hasValidDate = entryFields[1] && entryFields[1].trim() !== ""; // Prüfen, ob Start Date vorhanden ist
            const hasValidData = entryFields.some(field => field.trim() !== "");  // Überprüfen, ob irgendein Feld nicht leer ist

            // Überprüfe, ob der Eintrag "(Session reset)" oder eine Variation davon vorhanden ist
            const title = entryFields[0] ? entryFields[0].trim() : "";
            return hasValidDate && hasValidData && !title.toLowerCase().includes("session reset");
          })
          .map(entry => {
            // Spalten zuordnen und extrahieren
            const [title, startDate, startTime, endDate, endTime, description] = entry.split(",");

            // Daten validieren und formatieren
            const formattedStartDate = this.formatDate(startDate);
            const formattedEndDate = this.formatDate(endDate || startDate);
            const formattedStartTime = this.formatTime(startTime);
            const formattedEndTime = this.formatTime(endTime);

            return {
              title: title.trim() || "Event", // Standardtitel "Event"
              startDate: formattedStartDate || "",
              startTime: formattedStartTime || "",
              endDate: formattedEndDate || "",
              endTime: formattedEndTime || "",
              location: "", // Leer lassen, da es von der API nicht geliefert wird
              description: description ? description.trim() : "" // Bereinige Beschreibung, falls vorhanden
            };
          });

      // Setze analysierte Daten, nur Zeilen mit einem Startdatum werden übernommen
      this.analysisData = cleanedData.filter(entry => entry.startDate);
    },

    // Zeile hinzufügen
    addRow() {
      this.analysisData.push({
        title: "Event",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        location: "",
        description: "",
      });
    },

    // Zeile entfernen
    removeRow(index) {
      this.analysisData.splice(index, 1);
    },

    // Datum formatieren
    formatDate(date) {
      const dateObj = new Date(date);
      return isNaN(dateObj) ? "" : dateObj.toISOString().split("T")[0];
    },

    // Zeit formatieren
    formatTime(time) {
      if (!time) return ""; // Wenn die Zeit undefiniert ist, gib einen leeren String zurück
      const [hours, minutes] = time.split(":");
      if (!hours || !minutes) return ""; // Wenn das Format nicht stimmt, gib ebenfalls einen leeren String zurück
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`; // Formatiere die Zeit richtig
    },

    // CSV für Google Calendar generieren
    generateCSV(analysisData) {
      const csvContent =
          "Subject,Start Date,Start Time,End Date,End Time,Description\n" +
          analysisData
              .map((event) =>
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
    },

    // Bereinigen des extrahierten Textes
    cleanExtractedText(extractedText) {
      return extractedText
          .replace(/[^\w\säöüÄÖÜß:,-.]/g, "")  // Remove only unwanted special characters but keep dates, times, and letters
          .replace(/\s+/g, " ")  // Collapse multiple spaces into a single space
          .trim();  // Trim any extra spaces at the start and end
    },

    // Methode zum Importieren in den Google-Kalender
    importGoogleCalendar() {
      const prompt = `You are given text extracted from OCR. Your task is to extract the data present in the text, ensuring accurate interpretation of dates, times, and descriptions. Follow these rules strictly to ensure that the output meets all the requirements.

## Obligatory Important Instructions:

### 1. **Dataset Independence**:
   - Treat each dataset as completely independent from others. Do not infer or reference any prior datasets.

### 2. **Subject Assignment**:
   - Use "Event" as the value for the **Subject** field. Do not use "Work" or any other term unless explicitly stated in the text.

### 3. **Date and Time Recognition**:
   - **Start Date and End Date**: Use the same date for both the **Start Date** and **End Date** unless explicitly stated otherwise.
   - **Handling Overlapping or Redundant Time Ranges**:
      - If overlapping or redundant time ranges are found (e.g., "14:09-22:56" and "14:09-18:00" followed by "18:30-22:56"), combine them into a single range (e.g., "14:09-22:56") and avoid creating multiple entries for the same date.
   - **Non-overlapping Times**: If distinct, non-overlapping times exist for the same date (e.g., "06:24-11:00" and "11:30-14:51"), treat them as separate entries.
   - **Invalid or Missing Times**: If a time is invalid or missing, leave the **Start Time** and **End Time** fields blank. Do not infer times.

### 4. **Description Handling**:
   - **Contextual Descriptions**: Descriptions like "Arbeitszeit" or "Urlaub" should follow logically from the context. For instance:
     - If a date is followed by the word "Urlaub", assign "Urlaub" as the description for that entry.
     - Do not assign incorrect descriptions (e.g., avoid "Arbeitszeit" if "Urlaub" is clearly indicated).
   - **Avoid Redundancy**: Ensure descriptions like "Arbeitszeit" or "Stabidienst" are only applied once per relevant date and are not unnecessarily repeated.

### 5. **Handling Redundant or Incomplete Data**:
   - Ignore rows or entries that provide no meaningful data, such as placeholders or missing information. Focus only on rows with valid dates, times, and descriptions.
   - Ensure that no redundant rows are created for times or descriptions that have already been merged or addressed.

### 6. **Handling of Missing Years**:
   - If a year is missing from the date, use the current year. Always format dates as \`YYYY-MM-DD\` (ISO format).

### 7. **Data Formatting**:
   - **Date**: Format all dates as \`YYYY-MM-DD\` (ISO format).
   - **Time**: Format all times as \`HH:MM\` (24-hour format). If times are invalid or missing, leave the respective fields blank.

### 8. **No Content Modification**:
   - Do not infer or modify content beyond what is explicitly provided. Extract and format the data exactly as instructed, ensuring accurate interpretation without altering the intended meaning of the data.

### 9. **Session Reset**:
   - After providing the response, reset the session to avoid confusion between datasets and start afresh for the next set of OCR text.

## Example Output Structure:
Subject,Start Date,Start Time,End Date,End Time,Description
Event,2024-10-29,,2024-10-29,,"Urlaub"
Event,2024-10-30,,2024-10-30,,"Urlaub"
Event,2024-10-31,,2024-10-31,,"Urlaub"

## OCR Text:`;









      this.analyzeFile(prompt);
    },


    // Methode zum Importieren in den Apple-Kalender
    importAppleCalendar() {
      const prompt = "<- Analyze this Data, extract it for a (.ics) apple calendar output, no addition information or commenting";
      this.analyzeFile(prompt);
    },
  },
};
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 40px;
}

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
  background-color: #4285f4;
  color: white;
  border: none;
}

.apple-button {
  background-color: #000;
  color: white;
  border: none;
}

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

.row {
  position: relative;
  display: flex;
  align-items: center;
}

.centered-input {
  margin-left: auto;
  margin-right: auto;
}

.delete-button {
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;
}

.add-button {
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  font-size: 15px;
  position: fixed;
  bottom: 20px;
  left: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-button:hover,
.delete-button:hover {
  opacity: 0.8;
}
</style>
