import { createApp } from "vue"
import App from "./App.vue"
import router from "./scripts/router"
import store from "./scripts/store"

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');