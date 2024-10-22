import { createStore } from "vuex";
import Hacking from "../components/GameHacking/module"
import Signaling from "../components/GameSignaling/module"

const store = createStore({
  modules: {
    Hacking,
    Signaling
  },
});

export default store;