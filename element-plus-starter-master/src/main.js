import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/css/tailwind.css";

createApp(App)
  .use(router)
  .use(ElementPlus)
  .mount("#app");
