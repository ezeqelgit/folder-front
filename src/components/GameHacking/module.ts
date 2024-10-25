import { Module } from "vuex"
import { Hacking, MatrixData, Reward, SpecsData } from "./types/Hacking"

const Hacking: Module<Hacking, unknown> = ({
  state: {
    matrixData:{
      matrixSize: 5,
      matrixComplexity: 3,
    },
    specsData: {
      time: 90,
      bufferSize: 4
    },
    listRewards: [
      {
        nameReward: "добыча_данных_1",
        descriptionReward: "КАКОЕ-ТО ОПИСАНИЕ БУДЕТ ЗДЕСЬ, ПОЛЕЗНОЕ ДЛЯ ИГРОКА",
        complexityReward: 2
      },
      {
        nameReward: "добыча_данных_2",
        descriptionReward: "КАКОЕ-ТО ОПИСАНИЕ БУДЕТ ЗДЕСЬ, ПОЛЕЗНОЕ ДЛЯ ИГРОКА",
        complexityReward: 3
      },
      {
        nameReward: "добыча_данных_3",
        descriptionReward: "КАКОЕ-ТО ОПИСАНИЕ БУДЕТ ЗДЕСЬ, ПОЛЕЗНОЕ ДЛЯ ИГРОКА",
        complexityReward: 5
      },
    ],
  },
  getters: {
    getMatrixData: (state) => state.matrixData,
    getSpecsData: (state) => state.specsData,
    getListRewards: (state) => state.listRewards,
  },
  mutations: {
    setMatrixData(state, payload: MatrixData) {
      state.matrixData = payload
    },
    setSpecsData(state, payload: SpecsData) {
      state.specsData = payload
    },
    setListRewards(state, payload: Reward[]) {
      state.listRewards = payload
    },
  },
});

export default Hacking;