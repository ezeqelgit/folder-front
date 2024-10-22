import store from "../../scripts/store"
import router from "../../scripts/router"
import { Timer, Wires } from "./types/Signaling"

window.mp.events.add("CEF:SERVER:GameSignaling:Show", () => {
  if (router.currentRoute.value.name === 'Signaling') return; 
  router.push({ name: 'Signaling' });
});

window.mp.events.add("CEF:SERVER:GetWires", (json: string) => {
  const payload: Wires = JSON.parse(json);
  store.commit('setWires', payload);
});

window.mp.events.add("CEF:SERVER:GameSignaling:Timer", (json: string) => {
  const payload: Timer = JSON.parse(json);
  store.commit('setTimer', payload);
});