import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { setupDirectives } from '@/plugins/directives'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const authStore = useAuthStore(pinia)
authStore.initUserInfo()

app.use(pinia)
app.use(router)
app.use(ElementPlus)
setupDirectives(app)

app.mount('#app')