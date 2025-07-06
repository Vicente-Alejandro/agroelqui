import { createApp } from "vue"
import App from "./App.vue"
import "./assets/styles/main.css"

// Crear la aplicación Vue
const app = createApp(App)

// Configuración global
app.config.globalProperties.$formatNumber = (num) => {
  if (num === 0) return "0"
  return Math.round(num).toLocaleString("es-CL")
}

// Montar la aplicación
app.mount("#app")