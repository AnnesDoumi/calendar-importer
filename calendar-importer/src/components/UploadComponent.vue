
<template>
  <div>
    <h1>Upload a file or take a photo</h1>

    <!-- Kamera Foto aufnehmen -->
    <div>
      <video ref="video" width="320" height="240" autoplay></video>
      <button @click="takePhoto">Take Photo</button>
      <canvas ref="canvas" width="320" height="240" style="display: none;"></canvas>
    </div>

    <!-- Datei-Upload -->
    <input type="file" accept=".txt, image/*" multiple @change="handleFileUpload" />

    <!-- Buttons für Kalender -->
    <div>
      <button :class="{'active-button': isGoogleActive}" @click="importGoogleCalendar" :disabled="!isGoogleActive">Google Calendar</button>
      <button :class="{'active-button': isAppleActive}" @click="importAppleCalendar" :disabled="!isAppleActive">Apple Calendar</button>
    </div>

    <!-- Auswahl zwischen CSV und ICS -->
    <div>
      <input type="radio" id="csv" value="csv" v-model="importType">
      <label for="csv">Google Calendar (CSV)</label>

      <input type="radio" id="ics" value="ics" v-model="importType">
      <label for="ics">Apple Calendar (ICS)</label>
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
      isGoogleActive: false, // Aktiviert, wenn CSV ausgewählt und Datei hochgeladen wurde
      isAppleActive: false // Aktiviert, wenn ICS ausgewählt und Datei hochgeladen wurde
    };
  },
  methods: {
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      this.files = files;
      this.updateButtonState();
    },
    takePhoto() {
      const canvas = this.$refs.canvas;
      const video = this.$refs.video;
      canvas.getContext('2d').drawImage(video, 0, 0, 320, 240);
      const dataURL = canvas.toDataURL('image/png');
      this.files.push(dataURL);
      this.updateButtonState();
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

        console.log(response.data); // Hier kommt die Analyse zurück
        // Nutze die Analyse, um die Kalenderdatei zu generieren (CSV oder ICS)
      } catch (error) {
        console.error('Error analyzing file', error);
      }
    },
    updateButtonState() {
      if (this.importType === 'csv' && this.files.length > 0) {
        this.isGoogleActive = true;
      } else if (this.importType === 'ics' && this.files.length > 0) {
        this.isAppleActive = true;
      } else {
        this.isGoogleActive = false;
        this.isAppleActive = false;
      }
    },
    importGoogleCalendar() {
      if (this.isGoogleActive) {
        // Google Calendar API-Integration hier starten
        console.log("Import to Google Calendar");
      }
    },
    importAppleCalendar() {
      if (this.isAppleActive) {
        // Apple Calendar API-Integration hier starten
        console.log("Import to Apple Calendar");
      }
    }
  },
  mounted() {
    // Zugriff auf Kamera
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      this.$refs.video.srcObject = stream;
    });
  }
};
</script>

<style scoped>
.active-button {
  background-color: #4285F4; /* Google Blau */
}
button:disabled {
  background-color: #ccc; /* Deaktiviert */
}
</style>
