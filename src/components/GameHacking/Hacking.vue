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
            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea </span>
          </div>
        </div>
        <div class="process">
          <div class="buffer">
            <span>БУФЕР</span>
            <div class="table">
              <div class="wrapperTable"></div>
            </div>
          </div>
          <div class="matrix"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./style.scss" scoped></style>
<script lang="ts" src="./data"></script> 