import { defineComponent, computed, ref } from "vue"
import { ImportImages } from "../../utils/ImportImages"
import { useStore } from "vuex";
import { Hacking, Reward } from "./types/Hacking";
import { Complexity, MatrixComplexity } from "./types/MatrixComplexity";

const svg = ImportImages(require.context('./assets/svg/', false, /\.(png|jpe?g|svg)$/));

export default defineComponent({
  data() {
    return {
      svg,
    }
  },
  setup() {
    //module data
    const store = useStore<Hacking>();
    const matrixData = computed(() => store.getters.getMatrixData);
    const matrixSize = computed(() => matrixData.value.matrixSize);
    const matrixComplexity = computed(() => matrixData.value.matrixComplexity);

    const symbols = computed(() => {
      return Complexity[matrixComplexity.value as MatrixComplexity].symbols;
    });

    const specsData = computed(() => store.getters.getSpecsData);

    const bufferSize = computed(() => specsData.value.bufferSize);

    const buffer = ref<BufferItem[]>(new Array(specsData.value.bufferSize).fill(null).map(() => ({ value: null, isSelected: false })));

    const listRewards = computed(() =>
      store.getters.getListRewards.map((reward: Reward[]) => ({ ...reward, isWin: ref(null) }))
    );
    
    const clickedValue = ref<string | null>(null);

    const turn = ref(1);

    const clicksCount = ref(0);

    const pathsStatus = ref(
      listRewards.value.map((reward: any) => ({
        id: reward.id,
        isCompleted: null as boolean | null,
      }))
    );

    const unClickable = ref(false)

    // finish
    const checkAllPathsCompleted = () => {
      if (pathsStatus.value.every((status: any) => status.isCompleted !== null)) {
        unClickable.value = true;
        completeGame();
      }
    };

    const destroyedPaths = () => {
      listRewards.value.forEach((reward: any) => {
        if (reward.isWin.value === null) {
          reward.isWin.value = false;
        }
      });
    
      pathsStatus.value.forEach((status: any) => {
        if (status.isCompleted === null) {
          status.isCompleted = false;
        }
      });
      checkAllPathsCompleted();
    };

    const completeGame = () => {
      stopTimer();
      window.mp.trigger("CEF:SERVER:GameHacking:Finish", JSON.stringify(pathsStatus.value));
    };

    //timer
    const time = ref(store.getters.getSpecsData.time);
    const remainingTime = ref(time.value * 1000);
    const totalTime = ref(time.value * 1000);

    const formatMilliseconds = (ms: number): string => {
      if (ms == 0) {
        destroyedPaths()
      }
      const seconds = Math.floor(ms / 1000).toString().padStart(2, '0');
      const milliseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
        return `${seconds}:${milliseconds}`;
    };

    const formattedTime = ref(formatMilliseconds(remainingTime.value));

    const activeScaleWidth = computed(() => {
      return (remainingTime.value / totalTime.value) * 100;
    });

    let timer: ReturnType<typeof setInterval> | null = null;

    const startTimer = () => {
      timer = setInterval(() => {
        if (remainingTime.value > 0) {
          remainingTime.value -= 10;
          formattedTime.value = formatMilliseconds(remainingTime.value);
        } else {
            if (timer) {
              clearInterval(timer);
            }
          }
        }, 10);
      };

      const stopTimer = () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      };

    //matrix generation
    const matrix = computed(() => generateMatrix());

    function getRandomElement(array: any) {
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
    }
    
    const generateMatrix = () => {
      const matrix = [];

      const currentSymbols = symbols.value;
      
      for (let i = 0; i < matrixSize.value * matrixSize.value; i++) {
        matrix.push(getRandomElement(currentSymbols));
      }
      return matrix;
    };

    //matrix styles
    const gridStyle = computed(() => {
      if (matrixSize.value >= 5) {
        return {
          gridTemplateColumns: `repeat(${matrixSize.value}, ${100 / matrixSize.value}%)`,
          gridTemplateRows: `repeat(${matrixSize.value}, ${100 / matrixSize.value}%)`,
        };
      } else if (matrixSize.value == 4) {
        return {
          gridTemplateColumns: `repeat(${matrixSize.value}, ${80 / matrixSize.value}%)`,
          gridTemplateRows: `repeat(${matrixSize.value}, ${80 / matrixSize.value}%)`,
        };
      } else {
        return {
          gridTemplateColumns: `repeat(${matrixSize.value}, ${60 / matrixSize.value}%)`,
          gridTemplateRows: `repeat(${matrixSize.value}, ${60 / matrixSize.value}%)`,
        };
      }
    });
    
    const activeRow = ref<number | null>(null);
    const activeCol = ref<number | null>(null);
    const hoverRow = ref<number | null>(null);
    const hoverCol = ref<number | null>(null);

    const isActiveRow = (index: number): boolean => {
      return Math.floor(index / matrixSize.value) === activeRow.value;
    };
    
    const isActiveCol = (index: number): boolean => {
      return index % matrixSize.value === activeCol.value;
    };
    
    const isHoveredCell = (index: number): boolean => {
      if (turn.value == 1) {
        const colIndex = index % matrixSize.value;
        return colIndex === hoverCol.value;
      } else {
        const rowIndex = Math.floor(index / matrixSize.value);
        return rowIndex === hoverRow.value
      }
      
    };

    //buffer
    interface BufferItem {
      value: string | null;
      isSelected: boolean;
      isPermanent?: boolean;
      position?: number;
    }

    //matrix interaction
    const onMouseEnterCell = (cell: string, index: number) => {
      if (matrix.value[index] === "[ ... ]") return;

      const bufferIndex = buffer.value.findIndex(item => item.value === null);
      if (bufferIndex !== -1) {
        hoverRow.value = Math.floor(index / matrixSize.value);
        hoverCol.value = index % matrixSize.value;
        buffer.value[bufferIndex].value = cell;  
        buffer.value[bufferIndex].isSelected = true; 
        buffer.value[bufferIndex].position = index; 

        paths.value.forEach((path: any, pathIndex: any) => {
          path.forEach((step: any, stepIndex: any) => {
            if (path[clicksCount.value]?.value === cell) {
              path[clicksCount.value].isSoar = true;
            }
          });
        })
      }
    };

    const onMouseLeaveCell = (cell: number, index: number) => {
      const bufferIndex = buffer.value.findIndex(item => item.position === index);
      if (bufferIndex !== -1 && !buffer.value[bufferIndex].isPermanent) {
        hoverRow.value = null;
        hoverCol.value = null;
        buffer.value[bufferIndex].isSelected = false; 
        buffer.value[bufferIndex].value = null;

        paths.value.forEach((path: any, pathIndex: any) => {
          path.forEach((step: any, stepIndex: any) => {
            if (path[clicksCount.value]?.value === cell) {
              path[clicksCount.value].isSoar = false;
            }
          });
        })
      }
    };

    const onClickCell = (cell: string, index: number) => {
      if (unClickable.value == true) return; 
      if (clicksCount.value == 0) {
        startTimer();
      }
      if (!isCellClickable(index) || matrix.value[index] === "[ ... ]") return;
    
      clickedValue.value = cell;
      matrix.value[index] = "[ ... ]";
      lastClickedIndex.value = index;
      switchTurn();
    
      const bufferIndex = buffer.value.findIndex(item => item.position === index);
      if (bufferIndex !== -1) {
        activeRow.value = Math.floor(index / matrixSize.value);
        activeCol.value = index % matrixSize.value;
        buffer.value[bufferIndex].isPermanent = true;
        buffer.value[bufferIndex].isSelected = false;
      }
    
      paths.value.forEach((path: any, pathIndex: any) => {
        const rewardStatus = pathsStatus.value[pathIndex];
        if (listRewards.value[pathIndex].isWin.value != null) return;
    
        path.forEach((step: any, stepIndex: any) => {
          if (step.isChoosed && stepIndex < clicksCount.value) {
            step.isUsed = true;
            step.isChoosed = false;
          }
        });
    
        if (path[clicksCount.value]?.value === cell) {
          path[clicksCount.value].isSoar = false;
          path[clicksCount.value].isChoosed = true;
        } else {
          if (path.length < bufferSize.value) {
            path.unshift({ value: "", isChoosed: false, isUsed: false });
          } else {
            listRewards.value[pathIndex].isWin.value = false;
            rewardStatus.isCompleted = false;
          }
        }
    
        if (path.length <= clicksCount.value + 1) {
          listRewards.value[pathIndex].isWin.value = true;
          rewardStatus.isCompleted = true;
        }
      });
    
      // clicksCount++;
      clicksCount.value++;
      checkAllPathsCompleted();
    };

    //paths nd steps
    const generatePaths = () => {
      const paths = listRewards.value.map((reward: any) => {
        const path = [];
        let rowIndex = 0;
        let colIndex = Math.floor(Math.random() * matrixSize.value);
    
        for (let step = 0; step < reward.complexityReward; step++) {
          path.push({
            value: matrix.value[rowIndex * matrixSize.value + colIndex],
            isChoosed: false,
            isUsed: false,
            isSoar: false,
          });
    
          if (step % 2 === 0) {
            rowIndex = (rowIndex + 1) % matrixSize.value;
          } else {
            colIndex = (colIndex + (Math.random() > 0.5 ? 1 : -1) + matrixSize.value) % matrixSize.value;
          }
        }
    
        return path;
      });
      return paths;
    };
    
    const paths = ref(generatePaths());    

    //gameplay
    const lastClickedIndex = ref<number | null>(null);

    const getRowIndex = (index: number) => Math.floor(index / matrixSize.value);

    const getColIndex = (index: number) => index % matrixSize.value;

    const isCellClickable = (index: number): boolean => {
      const rowIndex = getRowIndex(index);
      const colIndex = getColIndex(index);
    
      if (lastClickedIndex.value === null) {
        activeRow.value = 0; 
        activeCol.value = null;
        return rowIndex === 0;
      } else if (turn.value === 1) {
        activeRow.value = getRowIndex(lastClickedIndex.value!); 
        activeCol.value = null; 
        return rowIndex === getRowIndex(lastClickedIndex.value!);
      } else {
        activeRow.value = null;
        activeCol.value = getColIndex(lastClickedIndex.value!); 
        return colIndex === getColIndex(lastClickedIndex.value!);
      }
    };
    
    const switchTurn = () => {
      turn.value = turn.value === 1 ? 2 : 1;
    };


    return{
      matrixSize,
      matrix,
      gridStyle,
      isActiveRow,
      isActiveCol,
      isHoveredCell,
      activeScaleWidth,
      buffer,
      onMouseEnterCell,
      onMouseLeaveCell,
      onClickCell,
      listRewards,
      paths,
      isCellClickable,
      clickedValue,
      clicksCount,
      formattedTime,
      unClickable
    }
  },
});