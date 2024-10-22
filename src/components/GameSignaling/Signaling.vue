<template>
  <div class="Signaling">
    <div class="windowGame">
      <div class="table">
        <img :src="svg['table']">
        <div class="workFlow">
          <div class="process">
            <div class="cover" :class="{ animating: coverAnimating }"
              :style="{ top: coverPosition.top, left: coverPosition.left }">
              <div class="seal" v-if="sealVisible" @click="removeSeal" :class="{ disappearing: isSealDisappearing }">
                <img :src="images['seal']">
              </div>
              <img :src="svg['cover']">
              <div class="bolts">
                <img v-for="bolt in bolts" :key="bolt.id" :src="images['bolt']" :class="{
                  rotating: bolt.isRotating,
                  removed: bolt.isRemoved,
                  disabled: sealVisible,
                }" @click="removeBolt(bolt)" />
              </div>
            </div>
            <img :src="svg['workspace']">
            <div class="wiresContainer">
              <div class="wires">
                <div v-for="(wire, index) in allWires" :key="index" class="cellWire">
                  <div class="leftPlug"></div>
                  <div class="wire" @mouseenter="showBlinkPart(wire)" @mouseleave="hideBlinkPart(wire)">
                    <img :src="isRuined(wire) ? WiresColor[wire].ruined : WiresColor[wire].whole">
                  </div>
                  <div class="rightPlug"></div>
                  <div class="blinkWrapper" :style="{
                    left: `${WiresColor[wire].blinkTranslateX}%`,
                    marginTop: `${WiresColor[wire].blinkTranslateY}%`
                  }">
                    <div class="blinkPart" v-if="isBlinkVisible(wire)"
                      :style="{
                        backgroundColor: WiresColor[wire].blinkColor ? `#${WiresColor[wire].blinkColor}` : 'transparent'
                      }"></div>
                    <div class="blinkOverlay" @click="handleClick(wire)" @mouseenter="showBlinkPart(wire)"
                      @mouseleave="hideBlinkPart(wire)"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="info">
            <div class="header">
              <div class="gameLogo">
                <img :src="svg['gameLogo']">
              </div>
              <div class="nameOfGame">
                <span>V1.15</span>
                <span>Homesecure</span>
              </div>
            </div>
            <div class="timer">
              <img :src="svg[EndTimerValue ? 'endtimer' : 'starttimer']">
              <div class="effect" :class="{ blink: EndTimerValue }" v-if="EndTimerValue"></div>
              <div class="count">
                <span :style="{ color: timerColor }">{{ formattedTime }}</span>
              </div>
            </div>
            <div class="task">
              <img :src="svg['task']">
              <div class="goals">
                <div v-for="(property, index) in goalColor" :key="index" class="cellGoal">
                  <div class="round"
                    :style="{ background: isTaskCompleted && index === 0 ? property.roundBackground : property.background }">
                    <div class="status"
                      :style="{ filter: property.filter, background: isTaskCompleted && index === 0 ? property.roundStatus : property.status }">
                    </div>
                  </div>
                  <span :style="{ color: property.isCompleted ? 'rgb(41, 216, 116)' : '' }">{{ property.goal }}</span>
                </div>
              </div>
            </div>
            <div class="dynamic">
              <img v-for="(item, index) in dynamicImages" :key="index" :src="svg[item]">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./style.scss" scoped></style>
<script lang="ts" src="./data"></script>