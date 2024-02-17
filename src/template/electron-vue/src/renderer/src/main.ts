import { createApp } from 'vue';
import router from './router';
import { createPinia } from 'pinia';
import App from './App.vue';

const pinia = createPinia();
import 'virtual:uno.css';

createApp(App).use(pinia).use(router).mount('#app');