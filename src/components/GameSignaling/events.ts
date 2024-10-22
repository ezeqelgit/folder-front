import store from "../../scripts/store"
import router from "../../scripts/router"
import { RouteLocationNormalized } from "vue-router"

window.mp.events.add("CEF:SERVER:GameSignalingShow", () => {
  const currentRoute = router.currentRoute.value as RouteLocationNormalized;
  if (currentRoute.name === 'Signaling') return; 
  router.push({ name: 'Signaling' });
});