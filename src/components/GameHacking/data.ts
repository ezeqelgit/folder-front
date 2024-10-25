import { defineComponent, computed, ref, onBeforeUnmount, onMounted } from "vue"
import { ImportImages } from "../../utils/ImportImages"
import { useStore } from "vuex";
import { Hacking } from "./types/Hacking";

const svg = ImportImages(require.context('./assets/svg/', false, /\.(png|jpe?g|svg)$/));
const symbols = ["BD", "55", "1C", "SO", "B5", "F4", "A3", "C2", "10", "G6"]

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

    const specsData = computed(() => store.getters.getSpecsData);
    const time = ref(store.getters.getSpecsData.time);
    const remainingTime = ref(time.value * 1000);
    const totalTime = ref(time.value * 1000);

    const formatMilliseconds = (ms: number): string => {
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

    const buffer = ref<BufferItem[]>(new Array(specsData.value.bufferSize).fill(null).map(() => ({ value: null, isSelected: false })));

    const listRewards = computed(() => store.getters.getListRewards);

    const turn = ref(1);

    let clicksCount = 0;


    //matrix generation
    const matrix = computed(() => generateMatrix());

    function getRandomElement(array: any) {
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
    }
    
    const generateMatrix = () => {
      const matrix = [];
      
      for (let i = 0; i < matrixSize.value * matrixSize.value; i++) {
        matrix.push(getRandomElement(symbols));
      }
      
      return matrix;
    };

    const gridStyle = computed(() => ({
      gridTemplateColumns: `repeat(${matrixSize.value}, 1fr)`,
      gridTemplateRows: `repeat(${matrixSize.value}, 1fr)`
    }));

    //matrix styles
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
      }
    };

    const onMouseLeaveCell = (index: number) => {
      const bufferIndex = buffer.value.findIndex(item => item.position === index);
      if (bufferIndex !== -1 && !buffer.value[bufferIndex].isPermanent) {
        hoverRow.value = null;
        hoverCol.value = null;
        buffer.value[bufferIndex].isSelected = false; 
        buffer.value[bufferIndex].value = null; 
      }
    };

    const onClickCell = (cell: string, index: number) => {
      if (clicksCount == 0) {
        startTimer();
      }
      if (!isCellClickable(index) || matrix.value[index] === "[ ... ]") return;
      
      paths.value.forEach((path, pathIndex) => {
        if (path.length === specsData.value.bufferSize) return;
    
        if (path[clicksCount] === cell) {
          choosedMap.value.set(pathIndex, clicksCount);
        } else {
          path.unshift('');

          const prevIndex = choosedMap.value.get(pathIndex);
          if (prevIndex !== undefined) {
            choosedMap.value.set(pathIndex, prevIndex + 1);
          }
        }
      });

      clicksCount++;
      
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
    };
    
    

    //paths nd steps
    const generatePaths = () => {
      const paths: string[][] = [];

      const getRowIndex = (index: number) => Math.floor(index / matrixSize.value);
      const getColIndex = (index: number) => index % matrixSize.value;

      const getNextValidStep = (currentIndex: number | null, remainingSteps: number): number => {
        let validIndexes = [];

        if (currentIndex === null) {
          validIndexes = matrix.value.map((_, idx) => idx);
        } else {
          if (remainingSteps % 2 === 1) {
            const rowIndex = getRowIndex(currentIndex);
            validIndexes = matrix.value.map((_, idx) => (getRowIndex(idx) === rowIndex ? idx : null)).filter((idx) => idx !== null);
          } else {
            const colIndex = getColIndex(currentIndex);
            validIndexes = matrix.value.map((_, idx) => (getColIndex(idx) === colIndex ? idx : null)).filter((idx) => idx !== null);
          }
        }

        return validIndexes[Math.floor(Math.random() * validIndexes.length)]!;
      };

      listRewards.value.forEach((reward: any, pathIndex: any) => {
        const path: string[] = [];
        let currentIndex: number | null = null;

        if (pathIndex === 0) {
          currentIndex = getNextValidStep(null, 1);
          while (getRowIndex(currentIndex) !== 0) {
            currentIndex = getNextValidStep(null, 1);
          }
        }

        for (let i = 0; i < reward.complexityReward; i++) {
          currentIndex = getNextValidStep(currentIndex, i + 1);
          path.push(matrix.value[currentIndex]);
        }

        paths.push(path);
      });

      return paths;
    };
  
    const paths = ref(generatePaths());

    const choosedPaths = ref<boolean[][]>(
      paths.value.map(() => Array(specsData.value.bufferSize).fill(false))
    );

    // const choosedMap = ref<Record<string, boolean>>({});

    const choosedMap = ref<Map<number, number>>(new Map());



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

    // onMounted(() => {
    //   startTimer();
    // });

    onBeforeUnmount(() => {
      if (timer) clearInterval(timer);
    });


    return{
      matrixSize,
      matrix,
      gridStyle,
      isActiveRow,
      isActiveCol,
      isHoveredCell,

      formattedTime,
      activeScaleWidth,

      buffer,
      onMouseEnterCell,
      onMouseLeaveCell,
      onClickCell,

      listRewards,
      paths,
      choosedPaths,

      isCellClickable,
      choosedMap
    }
  },
});