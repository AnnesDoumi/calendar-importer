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
        <tr v-for="(entry, index) in analysisData" :key="index" @mouseover="hoverIndex = index" @mouseleave="hoverIndex = -1">
          <td>
            <input v-model="entry.title" />
            <button
                v-if="hoverIndex === index"
                @click="removeRow(index)"
                class="delete-button"
            >-</button>
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

      <!-- Add new row button -->
      <div class="add-row">
        <button @click="addRow" class="add-button">+</button>
      </div>

      <div>
        <button @click="generateCSV(analysisData)">Export to Google Calendar CSV</button>
      </div>
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
      hoverIndex: -1, // To track which row is hovered for delete button
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
        const apiResponse = await axios.post("/api/groq", { prompt: `${prompt}: ${extractedText}` });

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
    }
    ,

    // Method to add a new row
    addRow() {
      this.analysisData.push({
        title: "Event", // Default values for the new row
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        location: "",
        description: "",
      });
    },

    // Method to remove a row
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
    }

    ,

    // Methode zum Importieren in den Google-Kalender
    importGoogleCalendar() {
      const prompt = `You are given text extracted from OCR. Your task is to extract only the data present in the text, interpreting dates and times as follows:

## Obligatory Important Instructions:

1. **Date Recognition:**
   - If a date appears in the text, use it as both the **Start Date** and **End Date** for that entry, unless otherwise clearly specified in the text.
   - **Multiple Times on the Same Date**: If multiple times are given for the same date, treat the earliest time as the **Start Time** and the latest time as the **End Time**. For example, if you see "Freitag 11.10.2024 14:09-22:56 14:09 - 18:00 18:30 - 22:56", take the time range 14:09-22:56 for that date and ignore the other times.
   - **Invalid or Redundant Times**: Ignore times that are redundant, irrelevant, or incorrectly formatted. Prioritize clearly valid time ranges that follow morning to evening patterns.

2. **Strict Extraction:**
   - Extract the data exactly as it appears in the text, but ignore meaningless characters like ". u <" or repeated symbols.
   - Only extract significant content. For example, "Dienstag 15.10.2024 Stabidienst 9 St-Nacht capusiibergreifend . u <" should extract "Dienstag 15.10.2024" as the date, and "Stabidienst 9 St-Nacht capusiibergreifend" as the description, ignoring ". u <".

3. **Handling of Missing Times:**
   - If the time is missing or seems invalid, leave the **Start Time** and **End Time** fields blank.

4. **Data Formatting:**
   - **Date**: Always format dates as \`YYYY-MM-DD\` (ISO format).
   - **Time**: Format times as \`HH:MM\` (24-hour format) if valid; otherwise, leave the field blank.

5. **No Content Modification:**
   - Do not alter or infer content that is not explicitly present. Only extract exactly what is provided in the text.

6. **Session Reset:**
   - After providing your response, reset the session to avoid confusion between datasets and start afresh for the next set of OCR text.

## Example Output Structure (this is for structure reference only):
Subject,Start Date,Start Time,End Date,End Time,Description
Event,2024-10-29,,2024-10-29,,
Event,2024-10-30,,2024-10-30,,
Event,2024-10-31,,2024-10-31,,`

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

/* Delete button on row hover */
.delete-button {
  display: inline-block;
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  width: 24px;
  height: 24px;
  text-align: center;
  cursor: pointer;
  margin-left: 10px;
}

.add-row {
  margin-top: 20px;
  text-align: left;
}

/* Add row button */
.add-button {
  background-color: green;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  width: 36px;
  height: 36px;
  text-align: center;
  cursor: pointer;
}

/* Hide delete button until hover */
td:hover .delete-button {
  display: inline-block;
}
</style>
