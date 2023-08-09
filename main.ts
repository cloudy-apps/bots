import { createApp } from "vue";
import App from "./components/App.vue";
import { setEnv } from "./components/useEnv";

fetch("/.env")
  .then((x) => x.json())
  .then((x) => {
    setEnv(x);
    createApp(App).mount("#app");
  });
