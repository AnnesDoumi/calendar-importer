import { createRouter, createWebHistory } from 'vue-router';
import UploadComponent from '../components/UploadComponent.vue'; // Hauptseite im components-Ordner
import PrivacyPolicy from '../components/PrivacyPolicy.vue'; // PrivacyPolicy im components-Ordner
import TermsOfUse from '../components/TermsOfUse.vue'
const routes = [
    {
        path: '/',
        name: 'UploadComponent',
        component: UploadComponent,
    },
    {
        path: '/privacy-policy',
        name: 'PrivacyPolicy',
        component: PrivacyPolicy,
    },

    {
        path: '/terms-of-use',
        name: 'TermsOfUse',
        component: TermsOfUse,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


export default router;
