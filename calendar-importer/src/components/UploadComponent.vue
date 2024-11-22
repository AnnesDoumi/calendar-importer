<template>
  <div id="app">

    <!-- Logo hinzufügen -->
    <img src="../assets/logo.png" alt="Logo" class="logo" />
    <h1>Calendar Importer</h1>
    <h2>Upload a screenshot of your Schedule</h2>
    <br>
    <br>
    <div class="upload-section">


      <!-- Datei-Upload -->
      <input type="file" accept="image/*" @change="handleFileUpload"/>

      <!-- Kamera Foto aufnehmen -->
      <!--  <button @click="openCameraModal">Take Photo</button>  -->

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
          Analyze File
        </button>


      </div>
    </div>
    <br>
    <br>
    <i>Upload a screenshot of your schedule, it will get analyzed and put in to a table.
      Correct the data if needed, then create an import file for your calendar, or import it directly.</i>


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
        <tr v-for="(entry, index) in analysisData" :key="index" @mouseover="entry.showDelete = true"
            @mouseleave="entry.showDelete = false">
          <td>
            <div class="row">
              <button v-if="entry.showDelete" class="delete-button" @click="removeRow(index)">-</button>
              <input v-model="entry.title" class="centered-input"/>
            </div>
          </td>
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
        <!-- Google Calendar Import -->
        <button @click="importToGoogleCalendar" class="google-button">
          Import to Google Calendar
        </button>

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
    // API Response verarbeiten
    processApiResponse(apiResponse) {
      if (!apiResponse || typeof apiResponse !== 'string') {
        console.error("API response is missing or not in expected format");
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
    }

    ,

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

    async importToGoogleCalendar() {
      try {
        const response = await axios.post("/api/google-calendar-import", {
          events: this.analysisData, // Die analysierten und bereinigten CSV-Daten
        });
        if (response.status === 200) {
          alert("Events successfully imported to Google Calendar!");
        }
      } catch (error) {
        console.error("Error importing to Google Calendar", error);
        alert("Failed to import events. Please try again.");
      }
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

    cleanExtractedText(extractedText) {
      // Regex for recognizing a URL (starts with http://, https://, or www)
      const urlPattern = /(?:https?:\/\/|www\.)\S+/i;

      // Regex for recognizing days of the week in English or German
      const weekdayPattern = /\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b/i;

      // Regex for recognizing dates in common formats (e.g., 08.10.2024 or 08/10/2024)
      const datePattern = /\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/;

      // Find position of the first link, weekday, or date
      const linkMatch = extractedText.match(urlPattern);
      const weekdayMatch = extractedText.match(weekdayPattern);
      const dateMatch = extractedText.match(datePattern);

      // Find the earliest occurrence between link, weekday, and date
      const firstOccurrence = Math.min(
          linkMatch ? linkMatch.index : Infinity,
          weekdayMatch ? weekdayMatch.index : Infinity,
          dateMatch ? dateMatch.index : Infinity
      );

      // If there is a link and a valid occurrence of weekday or date, cut everything before it
      if (linkMatch && firstOccurrence < Infinity) {
        extractedText = extractedText.substring(firstOccurrence);
      }

      // Continue with further cleaning after the cut
      return extractedText
          .replace(/[^\w\säöüÄÖÜß:,-./]/g, "")  // Remove unwanted special characters but keep dates, times, and letters
          .replace(/\s+/g, " ")  // Collapse multiple spaces into a single space
          .replace(/(\d+)[.,](\d+)/g, "$1:$2")  // Correct time format errors (e.g., 14.09 -> 14:09)
          .replace(/(\d+)\s*-\s*(\d+)/g, "$1-$2")  // Normalize hyphen between time ranges
          .replace(/\s*([:,-])\s*/g, "$1")  // Remove unnecessary spaces around colons, hyphens, commas
          .trim();  // Trim any extra spaces at the start and end
    }

    ,
    // Methode zum Importieren in den Google-Kalender
    importGoogleCalendar() {
      const prompt = `You are given text extracted from OCR. Your task is to extract only the data present in the text and format it for CSV export for Google Calendar, following the rules strictly.

## Key Rules:

### 1. **Date and Time Formatting**:
   - **Dates** with their **Times** found in the OCR Text you get, should all be represented at least once in the table with all other rules I give also applying.
   - **Start Time** and **End Time** should be analyzed from the OCR Text, recognizing the pattern of how the times are assigned to the dates in the data. In the most cases, the times will appear on the right side of a date until the next date starts.
   - **Dates** should be formatted as \`YYYY-MM-DD\` (ISO format).
   - **Times** should be formatted as \`HH:MM\` (24-hour format). If times are missing or invalid, leave the field blank.

### 2. **Handling Overlapping or Redundant Time Ranges**:
   - If a date has multiple overlapping or contiguous time periods (e.g., "06:24-11:00" and "11:30-14:51"), merge them into a single entry covering the full range (e.g., "06:24-14:51").
   - Do **not** create multiple entries for the same date if the time periods can be merged.
   - If there are **distinct non-overlapping time ranges**, such as separate shifts on the same day, treat them as separate entries (e.g., "06:24-11:00" and "15:00-18:00").

### 3. **Consolidation of Entries**:
   - Each entry should contain one distinct time range for a given date, consolidating any overlapping or contiguous time ranges.
   - **Do not split** or create separate rows for time ranges that can be merged into one.

### 4. **Eliminating Unnecessary Duplicate Entries**:
   - Ensure that each date is represented **once** with the consolidated time range, without unnecessary repetitions.
   - Avoid creating separate entries for the same time period in a date (e.g., if there are time declarations "06:30-10:30" and "11:00-15:00" and "06:30-15:00" for a single date, only use "06:30" as Start Time, and "15:00" as End Time).

### 5. **Subject Assignment Based on Context**:
   - Ensure that the subject is assigned correctly. For example, if the OCR states a date, the structure of the whole OCR should be analyzed, and the text (except for the times) found in the text for the date, should be used as the subject [see Example Output Structure(for reference) below].
   - Use text that appears on the right side of a date, until the next date starts, as the subject.

### 6. **Handling Invalid or Missing Times**:
   - If time declarations in the OCR text for a date are totally missing, leave the Start Time and End Time fields blank.
   - Do **not** infer times that are not explicitly present in the text.
   - Do not mistake a missing Times for a date, as a missing times for another date, therefore recognize how the information is put in the OCR TEXT.

### 7. **Session Reset**:
   - After processing the OCR text, reset the session to ensure no confusion or data overlap occurs between different datasets.

## Example Output Structure (for reference):
Subject,Start Date,Start Time,End Date,End Time,Description
Subject,YYYY-MM-DD,,YYYY-MM-DD,,"Event"
(insert assigned Subject here),2024-10-21,06:24,2024-10-21,14:51,"Event"

## OCR Text:
`;


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
  margin: 0px;
  padding: 0px;
  width: 100vw;
  height: 100vh;
  background-color: #1e1e2e; /* Dunkler Hintergrund */
  color: #ffffff; /* Weißer Text */
  overflow-x: hidden; /* Verhindert horizontales Scrollen */
}

.logo {
  max-width: 150px;
  margin-bottom: 20px;
}

h1 {
  color: #ffffff; /* Haupttext in Weiß */
}

i {
  color: #b2b2b2; /* Leichter Sekundärtext */
}

.upload-section {
  background-color: #28293e; /* Etwas helleres Dunkelgrau */
  padding: 0px;
  border-radius: 8px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  margin: 0 auto;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 8px; /* Runde Ecken für modernen Look */
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

button:hover {
  box-shadow: 0px 0px 12px rgba(78, 157, 255, 0.5);
}

.google-button {
  background-color: #4e9dff; /* Blaue Akzentfarbe */
  color: white;
}

.apple-button {
  background-color: #000; /* Schwarze Akzentfarbe */
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Transparenter schwarzer Hintergrund */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #28293e;
  padding: 20px;
  border-radius: 8px;
}

input[type="file"] {
  display: block;
  margin: 10px auto;
  background-color: #28293e;
  color: #b2b2b2;
  border: 2px solid #4e9dff;
  border-radius: 5px;
  padding: 10px;
}

/* Stile für die Tabelle */
.data-table {
  margin-top: 20px; /* Etwas Platz über der Tabelle */
  max-width: 80%; /* Begrenze die maximale Breite der Tabelle auf 80% des Bildschirms */
  margin: 0 auto;
  background-color: #28293e;
  border-radius: 8px;
  padding: 10px;
}

.data-table table {
  width: 100%; /* Volle Breite innerhalb des Containers */
  border-collapse: collapse; /* Entfernt doppelte Linien */
  background-color: #28293e;
  border-radius: 8px;
  overflow: hidden;
}

.data-table th,
.data-table td {
  border: 1px solid #4e9dff;
  padding: 8px 4px; /* Verringere das Padding, damit die Tabelle kompakter wird */
  text-align: center;
  font-size: 14px; /* Verkleinere die Schriftgröße */
  color: #ffffff;
}

.data-table th {
  background-color: #1e1e2e;
  font-weight: bold;
}

.data-table td input {
  background-color: transparent;
  border: none;
  color: #ffffff;
  text-align: center;
  font-size: 14px;
}

.data-table td input:focus {
  outline: none;
  border-bottom: 2px solid #4e9dff; /* Akzentfarbe beim Fokus */
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
  width: 25px;
  height: 25px;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.add-button {
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 30px;
  position: fixed;
  bottom: 20px;
  right: 20px; /* Platzierung auf der rechten Seite */
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  z-index: 1000; /* Damit der Button immer über der Tabelle bleibt */
}

.add-button:hover,
.delete-button:hover {
  opacity: 0.8;
  box-shadow: 0px 0px 12px rgba(255, 255, 255, 0.3);
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-x: hidden; /* Nur vertikales Scrollen erlauben */
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow-x: hidden;
}

</style>