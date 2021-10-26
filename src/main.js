import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/index'
import store from '@/store/index'
import '@/style/_main.scss'
import 'virtual:svg-icons-register'
import directives from '@/plugins/directives/index'

const app = createApp(App)

app.use(directives)
app.use(router)
app.use(store)

app.mount('#app')
