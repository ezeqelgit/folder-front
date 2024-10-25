import { defineComponent, ref, onMounted, onBeforeUnmount, computed, nextTick } from "vue"
import { ImportImages } from "../../utils/ImportImages"
import { Timer, Signaling } from "./types/Signaling"
import { Goal, GoalColor } from "./types/Goals"
import { WiresList, WiresColor  } from './types/Wires'
import { useStore } from "vuex"

const svg = ImportImages(require.context('./assets/svg/', false, /\.(png|jpe?g|svg)$/));
const wires = ImportImages(require.context('./assets/wires/', false, /\.(png|jpe?g|svg)$/));
const images = ImportImages(require.context('./assets/img/', false, /\.(png|jpe?g|svg)$/));

const getRandomWires = (total: number, correct: number): { allWires: WiresList[], correctWires: WiresList[] } => {

  if (total > 7) {
    total = 7;
  } else if (total < 1) {
    total = 1;
  }

  if (correct < 1) {
    correct = 1;
  } else if (correct >= total) {
    correct = total - 1;
    if (correct < 1) {
      correct = 1;
    }
  }

  const wiresArray = Object.values(WiresList).filter(value => typeof value === 'number') as WiresList[];
  const shuffledWires = wiresArray.sort(() => Math.random() - 0.5);
  const totalWires = shuffledWires.slice(0, total);
  const correctWires = totalWires.slice(0, correct);
  const allWires = totalWires.sort(() => Math.random() - 0.5);

  console.log(allWires, correctWires);
  
  return {
    allWires,
    correctWires,
  };
};

export default defineComponent({ 
  data() {
    return {
      svg,
      wires,
      images
    }
  },
  setup() {
    const sealVisible = ref(true);
    const isSealDisappearing = ref(false);
    const coverAnimating = ref(false);
    const bolts = ref([
      { id: 1, isRemoved: false, isRotating: false },
      { id: 2, isRemoved: false, isRotating: false },
    ]);
    const coverPosition = ref({ top: '0px', left: '0px' });
    const isDragging = ref(false);
    const goalColor = Object.values(GoalColor);
    const isTaskCompleted = ref(false);
    const processRect = ref<DOMRect | null>(null);
    const isSecondStageAllowed = ref(false);
    const canInteractWithWires = ref(false);
    const isLoss = ref(false);
    const isComplete = ref(false);
    const isCursor = ref(false);
    const currentCursor = ref("");
    const cursorPosition = ref({ x: 0, y: 0 });
    const isCursorWirecutters = ref(false)
    const isCursorScrewdriver = ref(false)


    const dynamicImages = ['dynamic', 'dynamic'];

    const updateGoalsForSeal = () => {
      const sealIntegrityGoal = goalColor[Goal.SealIntegrity];
      sealIntegrityGoal.isCompleted = true;
      sealIntegrityGoal.background = sealIntegrityGoal.roundBackground;
      sealIntegrityGoal.status = sealIntegrityGoal.roundStatus;
      isCursor.value = true;
      isCursorScrewdriver.value = true;
      currentCursor.value = require("./assets/img/screwdriver.png");
    }; 
    
    const updateGoalsForBolts = () => {
      const boltTightnessGoal = goalColor[Goal.BoltTightness];
      boltTightnessGoal.isCompleted = true;
      boltTightnessGoal.background = boltTightnessGoal.roundBackground;
      boltTightnessGoal.status = boltTightnessGoal.roundStatus;
      isCursor.value = false;
      isCursorScrewdriver.value = false;
      currentCursor.value = "";
    };

    const updateGoalsForCover = () => {
      const coverGoal = goalColor[Goal.ClosedLid];
      coverGoal.isCompleted = true;
      coverGoal.background = coverGoal.roundBackground;
      coverGoal.status = coverGoal.roundStatus;
      if (isComplete.value == false) {
        isCursor.value = true;
        isCursorWirecutters.value = true;
        currentCursor.value = require("./assets/img/wirecutters.png");
      }
    };

    const updateGoalsForFinish = () => {
      const finish = goalColor[Goal.WireIntegrity];
      finish.isCompleted = true;
      finish.background = finish.roundBackground;
      finish.status = finish.roundStatus;
      isCursor.value = false;
      isCursorWirecutters.value = false;
      window.mp.trigger("CEF:SERVER:GameSignaling:Finish");
    };

    const removeSeal = () => {
      isSealDisappearing.value = true;
      setTimeout(() => {
        sealVisible.value = false;
        updateGoalsForSeal();
        isTaskCompleted.value = true;
        isSecondStageAllowed.value = false;
        checkCoverPosition();
      }, 1000);
    };

    const removeBolt = (bolt: any) => {
      if (!sealVisible.value && !bolt.isRemoved) {
        bolt.isRotating = true;
        setTimeout(() => {
          bolt.isRotating = false;
          bolt.isRemoved = true;
          if (bolts.value.every(b => b.isRemoved)) {
            coverAnimating.value = true;
            updateGoalsForBolts();
          }
        }, 1000);
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      if (coverAnimating.value && event.button === 0) {
        isDragging.value = true;
        const offsetX = event.clientX - parseInt(coverPosition.value.left);
        const offsetY = event.clientY - parseInt(coverPosition.value.top);
        checkCoverPosition();
        
        const onMouseMove = (event: MouseEvent) => {
          if (isDragging.value) {
            coverPosition.value.left = `${event.clientX - offsetX}px`;
            coverPosition.value.top = `${event.clientY - offsetY}px`;
            requestAnimationFrame(checkCoverPosition);
          }
        };

        const onMouseUp = () => {
          isDragging.value = false;
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      }
    };

    const store = useStore<Signaling>();

    const Timer = computed(() => {
      return store.getters.getTimer as Timer; 
    });

    const StartTimerValue = ref(Timer.value.start);
    let interval: ReturnType<typeof setInterval> | null = null;

    const EndTimerValue = computed(() => StartTimerValue.value <= Timer.value.end);

    const timerColor = computed(() => {
      return EndTimerValue.value ? 'rgb(255, 73, 76)' : '';
    });

    const formattedTime = computed(() => {
      const minutes = Math.floor(StartTimerValue.value / 60);
      const seconds = StartTimerValue.value % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    });

    const startTimer = () => {
      interval = setInterval(() => {
        if (StartTimerValue.value > 0) {
          StartTimerValue.value--;
        }
      }, 1000);
    };

    const stopTimer = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const activateNextGoalsStage = () => {
      if (bolts.value.every(bolt => bolt.isRemoved)) {
        const sealIntegrityGoal = goalColor[Goal.SealIntegrity];
        sealIntegrityGoal.status = sealIntegrityGoal.roundStatus;
        sealIntegrityGoal.background = sealIntegrityGoal.roundBackground;
      }
    };

    const checkCoverPosition = () => {
      if (processRect.value) {
        const coverTop = parseInt(coverPosition.value.top);
        const coverLeft = parseInt(coverPosition.value.left);
        const coverHeight = 650;
        const coverWidth = 650;
    
        const isOverlapping =
          coverTop < processRect.value.bottom &&
          coverTop + coverHeight > processRect.value.top &&
          coverLeft < processRect.value.right &&
          coverLeft + coverWidth > processRect.value.left;
    
        if (!isOverlapping) {
          updateGoalsForCover();
          canInteractWithWires.value = true;
          activateNextGoalsStage();
        }
      }
    };

    const wires = computed(() => store.getters.getWires);
    
    const { allWires, correctWires } = getRandomWires(wires.value.total, wires.value.correct);

    const ruinedWires = ref<Set<WiresList>>(new Set());

    const blinkVisibility = ref<Partial<Record<WiresList, boolean>>>({});

    const handleClick = (wire: WiresList) => {
      if (canInteractWithWires.value == false) return
      if(isLoss.value == false){
        if (correctWires.includes(wire) && !isRuined(wire)) {
          ruinedWires.value.add(wire);
          blinkVisibility.value[wire] = false;

          if (ruinedWires.value.size === correctWires.length) {
            isComplete.value = true;
            isLoss.value = true;
            updateGoalsForFinish()
            stopTimer();
          }
        } else {
          isLoss.value = true;
          stopTimer();
        }
      }
    };

    const showBlinkPart = (wire: WiresList) => {
        blinkVisibility.value[wire] = true;
    };

    const hideBlinkPart = (wire: WiresList) => {
      blinkVisibility.value[wire] = false;
    };

    const isBlinkVisible = (wire: WiresList) => {
      if (canInteractWithWires.value == false) return
      if (isLoss.value == false) {
        return blinkVisibility.value[wire] && !isRuined(wire);
      }
    };

    const isRuined = (wire: WiresList) => {
      return ruinedWires.value.has(wire);
    };

    const updateCursorPosition = (event: MouseEvent) => {
      cursorPosition.value.x = event.clientX;
      cursorPosition.value.y = event.clientY;
    };

    onMounted(async () => {
      startTimer();
      await nextTick();
      const coverElement = document.querySelector('.cover');
      if (coverElement) {
        coverElement.addEventListener('mousedown', onMouseDown as EventListener);
      }
      processRect.value = document.querySelector('.process')?.getBoundingClientRect() || null;
    });

    onBeforeUnmount(() => {
      const coverElement = document.querySelector('.cover');
      if (coverElement) {
        coverElement.removeEventListener('mousedown', onMouseDown as EventListener);
      }
      if (interval) {
        clearInterval(interval);
      }
    });

    return {
      sealVisible,
      bolts,
      removeSeal,
      removeBolt,
      isSealDisappearing,
      coverAnimating,
      coverPosition,
      Timer,
      formattedTime,
      StartTimerValue,
      EndTimerValue,
      timerColor,
      dynamicImages,
      goalColor,
      isTaskCompleted,
      allWires,
      WiresColor,
      handleClick,
      isRuined,
      showBlinkPart,
      hideBlinkPart,
      isBlinkVisible,
      isCursor,
      currentCursor,
      cursorPosition,
      updateCursorPosition,
      isCursorScrewdriver,
      isCursorWirecutters
    };
  },
});