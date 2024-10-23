import { Module } from "vuex"
import { Signaling, Timer, Wires } from "./types/Signaling"

const Signaling: Module<Signaling, unknown> = ({
  state: {
    wires: {
      total: 1,
      correct: 1
    },
    timer: {
      start: 100,
      end: 95
    }
  },
  getters: {
    getWires: (state) => state.wires,
    getTimer: (state) => state.timer,
  },
  mutations: {
    setWires(state , payload: Wires) {
      state.wires = payload;
    },
    setTimer(state, payload: Timer) {
      state.timer = payload
    }
  },
});

export default Signaling;
