import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initDexie } from './db/dexie'

initDexie();

createApp(App).use(router).mount('#app')
