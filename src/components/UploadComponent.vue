
<template>
  <div id="app">
    <header>
      <h1>Calendar Importer App</h1>
    </header>

    <div class="upload-section">
      <h2>Upload a file or take a photo</h2>

      <!-- Datei-Upload -->
      <input type="file" accept=".txt, image/*" multiple @change="handleFileUpload" />

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
        <button @click="importGoogleCalendar" class="google-button">Import to Google Calendar</button>
        <button @click="importAppleCalendar" class="apple-button">Import to Apple Calendar</button>
      </div>

      <!-- Auswahl zwischen CSV und ICS -->
      <div class="import-options">
        <label>
          <input type="radio" id="csv" value="csv" v-model="importType">
          Google Calendar (CSV)
        </label>
        <label>
          <input type="radio" id="ics" value="ics" v-model="importType">
          Apple Calendar (ICS)
        </label>
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
import axios from 'axios';

export default {
  data() {
    return {
      importType: '', // 'csv' oder 'ics'
      files: [], // Dateien, die hochgeladen wurden
      showCamera: false, // Steuert das Anzeigen des Kameramodals
      analysisData: [] // Speichert die analysierten Daten
    };
  },
  methods: {
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      this.files = files;
      // Hier könntest du die Upload-Logik erweitern
    },
    openCameraModal() {
      this.showCamera = true;
      // Starte den Kamerazugriff nur, wenn das Modal geöffnet wird
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.$refs.video.srcObject = stream;
      });
    },
    closeCameraModal() {
      this.showCamera = false;
      const video = this.$refs.video;
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop()); // Stoppe die Kamera
      video.srcObject = null; // Kameraausgabe entfernen
    },
    takePhoto() {
      const canvas = document.createElement('canvas');
      const video = this.$refs.video;
      canvas.width = 320;
      canvas.height = 240;
      canvas.getContext('2d').drawImage(video, 0, 0, 320, 240);
      const dataURL = canvas.toDataURL('image/png');
      this.files.push(dataURL);
      this.closeCameraModal(); // Kamera schließen nach dem Foto
    },
    async analyzeFile() {
      try {
        const formData = new FormData();
        this.files.forEach(file => {
          formData.append('file', file);
        });

        const response = await axios.post('https://api.openai.com/v1/chat/completions', formData, {
          headers: {
            'Authorization': `Bearer ${process.env.VUE_APP_OPENAI_API_KEY}`, // In .env Datei definiert
            'Content-Type': 'multipart/form-data'
          }
        });

        this.analysisData = response.data.analyzedEvents; // Beispielhafte Struktur
      } catch (error) {
        console.error('Error analyzing file', error);
      }
    },
    importGoogleCalendar() {
      console.log("Import to Google Calendar selected");
      // Integration der Google Calendar API
    },
    importAppleCalendar() {
      console.log("Import to Apple Calendar selected");
      // Integration der Apple Calendar API
    }
  }
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

.data-table th, .data-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.data-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

</style>
