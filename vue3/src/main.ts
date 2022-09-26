import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

import axios from "axios";
import VueAxios from "vue-axios";

import HomeLayout from "./components/HomeLayout.vue";
import EmptyLayout from "./components/EmptyLayout.vue";

const app = createApp(App);

app.component("default-layout", HomeLayout);
app.component("empty-layout", EmptyLayout);

app.use(router);
app.use(VueAxios, axios);
app.mount("#app");
