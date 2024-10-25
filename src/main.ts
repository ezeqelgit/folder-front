if (process.env.NODE_ENV !== "production") {
  window.mp = {
    trigger: (event: string, data: any) => {
      console.log(`Trigger: ${event}`, data);
      return {};
    },
    events: {
      add: () => {
        return {};
      },
      call: (...args: any[]) => {
        console.log(args);
        return 0;
      },
      remove: () => {
        return {};
      },
      callProc: async () => {
        return null;
      }
    },
    invoke: () => {
      return {};
    }
  };
}

import { createApp } from "vue"
import App from "./App.vue"
import router from "./scripts/router"
import store from "./scripts/store"
import events from "./scripts/events"

const app = createApp(App);

app.use(router);
app.use(store);
app.use(events);

app.mount('#app');