import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/base/index.scss'
import '@/assets/base/theme.scss'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { IconPark } from "@icon-park/vue-next/es/all";

const app = createApp(App)

app.component("IconPark", IconPark)

app.use(store).use(router).use(ElementPlus).mount('#app')
