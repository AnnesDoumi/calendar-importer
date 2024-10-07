<template>
  <div id="app">
    <!-- Binde das UploadComponent hier ein -->
    <UploadComponent />
  </div>
</template>

<script>
// Importiere das UploadComponent
import UploadComponent from './components/UploadComponent.vue';

export default {
  name: 'App',
  components: {
    UploadComponent // Registriere das Component
  }
};
</script>

<style>
/* Optionale globale Stile für die App */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

header {
  background-color: #f3f3f3;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
