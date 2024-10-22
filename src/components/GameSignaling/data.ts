import { defineComponent, ref, onMounted, onBeforeUnmount, computed, nextTick } from "vue"
import { ImportImages } from "../../utils/ImportImages"
import { Timer, Signaling } from "./types/Signaling"
import { Goal, WiresColor } from "./types/Goals"
import { useStore } from "vuex"

const svg = ImportImages(require.context('./assets/svg/', false, /\.(png|jpe?g|svg)$/));
const wires = ImportImages(require.context('./assets/wires/', false, /\.(png|jpe?g|svg)$/));
const images = ImportImages(require.context('./assets/img/', false, /\.(png|jpe?g|svg)$/));

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
    const wiresColor = Object.values(WiresColor);
    const isFirstTaskCompleted = ref(false);
    const processRect = ref<DOMRect | null>(null);
    const isSecondStageAllowed = ref(false);

    const updateGoalsForSeal = () => {
      const sealIntegrityGoal = wiresColor[Goal.SealIntegrity];
      sealIntegrityGoal.isCompleted = true;
      sealIntegrityGoal.background = "radial-gradient(61.00% 61.00% at 50% 50%, rgb(60, 255, 143), rgb(36, 164, 91) 100%)";
      sealIntegrityGoal.status = "rgb(38, 203, 109)";
      sealIntegrityGoal.filter = "blur(20.6px)";
    };
    
    const updateGoalsForBolts = () => {
      const boltTightnessGoal = wiresColor[Goal.BoltTightness];
      boltTightnessGoal.isCompleted = true;
      boltTightnessGoal.background = "radial-gradient(61.00% 61.00% at 50% 50%, rgb(60, 255, 143), rgb(36, 164, 91) 100%)";
      boltTightnessGoal.status = "rgb(38, 203, 109)";
      boltTightnessGoal.filter = "blur(20.6px)";
    };

    const updateGoalsForCover = () => {
      const coverGoal = wiresColor[Goal.ClosedLid];
      coverGoal.isCompleted = true;
      coverGoal.background = "radial-gradient(61.00% 61.00% at 50% 50%, rgb(60, 255, 143), rgb(36, 164, 91) 100%)";
      coverGoal.status = "rgb(38, 203, 109)";
      coverGoal.filter = "blur(20.6px)";
    };

    const dynamicImages = ['dynamic', 'dynamic'];

    const removeSeal = () => {
      isSealDisappearing.value = true;
      setTimeout(() => {
        sealVisible.value = false;
        updateGoalsForSeal();
        isFirstTaskCompleted.value = true;
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
            console.log("Перемещение cover:", coverPosition.value);
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

    const activateNextGoalsStage = () => {
      if (bolts.value.every(bolt => bolt.isRemoved)) {
        const sealIntegrityGoal = wiresColor[Goal.SealIntegrity];
        sealIntegrityGoal.status = "rgb(38, 203, 109)";
        sealIntegrityGoal.background = "radial-gradient(61.00% 61.00% at 50% 50%, rgb(60, 255, 143), rgb(36, 164, 91) 100%)";
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
          activateNextGoalsStage();
        }
      }
    };

    onMounted(async () => {
      startTimer();
      await nextTick();
      const coverElement = document.querySelector('.cover');
      if (coverElement) {
        coverElement.addEventListener('mousedown', onMouseDown as EventListener);
      }
      processRect.value = document.querySelector('.process')?.getBoundingClientRect() || null;
      console.log("processRect обновлён:", processRect.value);
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
      wiresColor,
      isFirstTaskCompleted,
    };
  },
});