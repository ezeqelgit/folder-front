<template>
  <div class="Signaling">
    <div class="windowGame">
      <div class="table">
        <img :src="svg['table']">
        <div class="workFlow">
          <div class="process">
            <div class="cover" :class="{ animating: coverAnimating }" :style="{ top: coverPosition.top, left: coverPosition.left }">
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
                <div class="cellWire">
                  <div class="leftPlug"></div>
                  <div class="wire">
                    <img :src="wires['red']">
                  </div>
                  <div class="rightPlug"></div>
                </div>
                <div class="cellWire">
                  <div class="leftPlug"></div>
                  <div class="wire">
                    <img :src="wires['green']">
                  </div>
                  <div class="rightPlug"></div>
                </div>
                <div class="cellWire">
                  <div class="leftPlug"></div>
                  <div class="wire">
                    <img :src="wires['white']">
                  </div>
                  <div class="rightPlug"></div>
                </div>
                <div class="cellWire">
                  <div class="leftPlug"></div>
                  <div class="wire">
                    <img :src="wires['grey']">
                  </div>
                  <div class="rightPlug"></div>
                </div>
                <div class="cellWire">
                  <div class="leftPlug"></div>
                  <div class="wire">
                    <img :src="wires['blue']">
                  </div>
                  <div class="rightPlug"></div>
                </div>
                <div class="cellWire">
                  <div class="leftPlug"></div>
                  <div class="wire">
                    <img :src="wires['yellow']">
                  </div>
                  <div class="rightPlug"></div>
                </div>
                <div class="cellWire">
                  <div class="leftPlug"></div>
                  <div class="wire">
                    <img :src="wires['purple']">
                  </div>
                  <div class="rightPlug"></div>
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
                <div class="cellGoal">
                  <div class="round">
                    <div class="status"></div>
                  </div>
                  <span>Целостность пломбы</span>
                </div>
                <div class="cellGoal">
                  <div class="round">
                    <div class="status"></div>
                  </div>
                  <span>Закрученность болтов</span>
                </div>
                <div class="cellGoal">
                  <div class="round">
                    <div class="status"></div>
                  </div>
                  <span>Закрытая крышка</span>
                </div>
                <div class="cellGoal">
                  <div class="round">
                    <div class="status"></div>
                  </div>
                  <span>Целостность проводов</span>
                </div>
              </div>
            </div>
            <div class="dynamic">
              <img :src="svg['dynamic']">
              <img :src="svg['dynamic']">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./style.scss" scoped></style>
<script lang="ts" src="./data"></script>