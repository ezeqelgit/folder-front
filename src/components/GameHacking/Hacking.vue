<template>
  <div class="Hacking">
    <div class="windowGame">
      <img :src="svg['backgroundgame']">
      <div class="game">
        <div class="header">
          <div class="title">
            <span>ВЗЛОМ СИГНАЛИЗАЦИИ</span>
          </div>
          <div class="description">
            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea </span>
          </div>
        </div>
        <div class="process">
          <div class="buffer">
            <span>БУФЕР</span>
            <div class="table">
              <div class="wrapperTable">
                <div class="timer">
                  <div class="wrapperTimer">
                    <div class="title">
                      <span>ВРЕМЯ ДЕЙСТВИЯ УЯЗВИМОСТИ</span>
                    </div>
                    <div class="count">
                      <span>{{ formattedTime }}</span>
                    </div>
                  </div>
                  <div class="scale">
                    <div class="activeScale" :style="{ width: activeScaleWidth + '%' }"></div>
                  </div>
                </div>
                <div class="result">
                  <div class="block">
                    <div class="cellBuffer" v-for="(item, index) in buffer" :key="index"
                      :class="{ selected: item && item.isSelected }">
                      <div class="numberMatrix">
                        <span>{{ item ? item.value : '' }}</span>
                      </div>
                      <div class="separator"></div>
                    </div>
                  </div>
                  <div class="description">
                    <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua. Ut </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="matrix">
            <div class="blockMatrix">
              <div class="headerMatrix">
                <img :src="svg['union']">
                <span>матрица</span>
              </div>
              <div class="bodyMatrix">
                <div class="gridMatrix" :style="gridStyle">
                  <div class="cellMatrix" v-for="(cell, index) in matrix" :key="index"
                    @mouseenter="onMouseEnterCell(cell, index)" @mouseleave="onMouseLeaveCell(index)"
                    @click="onClickCell(cell, index)" :class="{
                      'disabled': !isCellClickable(index) || cell === '[ ... ]',
                      'hovered': isHoveredCell(index),
                      'active-row': isActiveRow(index),
                      'active-col': isActiveCol(index)
                    }">
                    <div class="externalLayerCellMatrix">
                      <div class="internalLayerCellMatrix">
                        <span>{{ cell }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="consistency">
              <div class="title">
                <div class="wrapper">
                  <img :src="svg['checkbox']">
                  <span>ПОСЛЕДОВАТЕЛЬНОСТЬ ДЛЯ ОТПРАВКИ СКРИПТОВ</span>
                </div>
              </div>
              <div class="info">
                <div class="cellInfo" v-for="(reward, index) in listRewards" :key="index">
                  <div class="sequenceOptions">
                    <div class="cellSequenceOptions" v-for="(symbol, pathElementIndex) in paths[index]" :key="pathElementIndex"
                      :class="{ 'choosed': choosedMap.get(index) === pathElementIndex }">
                      <div class="externalLayerCellSequenceOptions">
                        <div class="internalLayerCellSequenceOptions">
                          <span>{{ symbol }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="cellAward">
                    <div class="icon">
                      <img :src="svg['extraction']">
                    </div>
                    <div class="description">
                      <div class="nameAward">
                        <span>{{ reward.nameReward }}</span>
                      </div>
                      <div class="outline">
                        <span>{{ reward.descriptionReward }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./style.scss" scoped></style>
<script lang="ts" src="./data"></script>