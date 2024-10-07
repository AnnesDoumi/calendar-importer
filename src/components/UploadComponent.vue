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
import Tesseract from "tesseract.js";

export default {
  data() {
    return {
      files: [],
      showCamera: false,
      analysisData: [],
    };
  },
  methods: {
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      this.files = files;
    },
    openCameraModal() {
      this.showCamera = true;
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.$refs.video.srcObject = stream;
      });
    },
    closeCameraModal() {
      this.showCamera = false;
      const video = this.$refs.video;
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    },
    takePhoto() {
      const canvas = document.createElement("canvas");
      const video = this.$refs.video;
      canvas.width = 320;
      canvas.height = 240;
      canvas.getContext("2d").drawImage(video, 0, 0, 320, 240);
      const dataURL = canvas.toDataURL("image/png");
      this.files.push(dataURL);
      this.closeCameraModal();
    },
    async analyzeFile() {
      try {
        if (this.files.length === 0) {
          console.error("No files uploaded");
          return;
        }

        // OCR-Verarbeitung
        const file = this.files[0];
        const result = await Tesseract.recognize(file, "eng", {
          logger: (m) => console.log(m),
        });

        const extractedText = result.data.text;
        console.log("Extracted text from image:", extractedText);

        // Sende Anfrage an Backend, um GROQ zu verwenden
        const response = await fetch('/api/extract-calendar-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: `Extract calendar data: ${extractedText}` }),
        });

        const { entries } = await response.json();
        this.analysisData = entries;
      } catch (error) {
        console.error("Error analyzing file", error);
      }
    },

    async generateFiles() {
      try {
        const response = await fetch('/api/generate-files', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ entries: this.analysisData }),
        });

        const result = await response.json();
        console.log(result.message);
      } catch (error) {
        console.error('Error generating files:', error);
      }
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
</style>
