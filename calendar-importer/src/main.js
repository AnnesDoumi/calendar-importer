import { createApp } from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App.vue';
import router from './router'; // Den Router importieren
import 'normalize.css';



createApp(App).use(router).mount('#app');

