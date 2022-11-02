import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import Router from './router/index'

const app = createApp(App)
app.use(Router)
app.use(ElementPlus)
app.mount('#app')
