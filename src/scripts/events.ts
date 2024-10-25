import { App, Plugin } from "vue";

const events: Plugin = {
  install(app: App) {
    if (!window.mp) {
      window.mp = {
        events: {
          add: (event: string, callback: Function) => {
            console.log(`Event added: ${event}`);
          },
          call: (event: string, ...args: any[]) => {
            console.log(`Event called: ${event}`, args);
          },
          callProc: async (event: string, ...args: any[]) => {
            console.log(`Event called asynchronously: ${event}`, args);
            return {};
          }
        },
        trigger: (event: string, ...args: any[]) => {
          console.log(`Event triggered: ${event}`, args);
        }
      };
    }

    window.bsurl = process.env.NODE_ENV === "production" ? "/Main" : "";
    
    require("../components/GameSignaling/events");
  }
};

export default events;
