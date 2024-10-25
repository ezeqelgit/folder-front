import store from "../../scripts/store"
import router from "../../scripts/router"
import { MatrixData, Reward, SpecsData } from "./types/Hacking";

window.mp.events.add("CEF:SERVER:GameHacking:Show", () => {
  if (router.currentRoute.value.name === 'Signaling') return; 
  router.push({ name: 'Signaling' });
});

window.mp.events.add("CEF:SERVER:GameHacking:MatrixData", (json: string) => {
  const payload: MatrixData = JSON.parse(json);
  store.commit('setMatrixData', payload);
});

window.mp.events.add("CEF:SERVER:GameHacking:SpecsData", (json: string) => {
  const payload: SpecsData = JSON.parse(json);
  store.commit('setSpecsData', payload);
});

window.mp.events.add("CEF:SERVER:GameHacking:ListRewards", (json: string) => {
  const payload: Reward[] = JSON.parse(json);
  store.commit('setListRewards', payload);
});