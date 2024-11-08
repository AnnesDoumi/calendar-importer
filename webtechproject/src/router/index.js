// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../components/LandingPage.vue';
import Impressum from '../components/ImpressumPage.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: LandingPage,
    },
    {
        path: '/impressum',
        name: 'Impressum',
        component: Impressum,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
