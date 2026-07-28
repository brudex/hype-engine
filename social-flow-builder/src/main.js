import { createApp } from 'vue';
import { createPinia } from 'pinia';
import StandaloneApp from './standalone/StandaloneApp.vue';
import './styles/base.css';

createApp(StandaloneApp).use(createPinia()).mount('#app');
