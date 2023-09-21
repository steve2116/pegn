<script lang="ts" setup>
import BackButton from "../../parts/BackButton.vue";
import SpeechBox from "../../parts/SpeechBox.vue";
</script>

<template>
  <section id="map-city-cleodores">
    <SpeechBox
      v-if="speech"
      :textCycle="speech"
      :onComplete="stopTalking"
    />
    <BackButton :backTab="backClick" />
    <header>
      <h1>Cleodores</h1>
    </header>
    <main>
      <button
        :class="`cleodores-option${
          dataFile.unlocked('cleodores/mayorsOffice') ? '' : ' disabled'
        }`"
        :disabled="!dataFile.unlocked('cleodores/mayorsOffice')"
      >
        Mayor's Office
      </button>
      <button
        :class="`cleodores-option${
          dataFile.unlocked('cleodores/mercenaryGuild') ? '' : ' disabled'
        }`"
        @click="mercenaryGuildClick"
        :disabled="!!speech || !dataFile.unlocked('cleodores/mercenaryGuild')"
      >
        Mercenary Guild
      </button>
      <button
        :class="`cleodores-option${
          dataFile.unlocked('cleodores/jobsBoard') ? '' : ' disabled'
        }`"
        :disabled="!dataFile.unlocked('cleodores/jobsBoard')"
      >
        Job's Board
      </button>
      <button
        :class="`cleodores-option${
          dataFile.unlocked('cleodores/marketplace') ? '' : ' disabled'
        }`"
        :disabled="!dataFile.unlocked('cleodores/marketplace')"
      >
        Marketplace
      </button>
      <button
        :class="`cleodores-option${
          dataFile.unlocked('cleodores/guardsTower') ? '' : ' disabled'
        }`"
        :disabled="!dataFile.unlocked('cleodores/guardsTower')"
      >
        Guard's Tower
      </button>
      <button
        :class="`cleodores-option${
          dataFile.unlocked('cleodores/cityGate') ? '' : ' disabled'
        }`"
        :disabled="!dataFile.unlocked('cleodores/cityGate')"
      >
        City Gate
      </button>
      <button
        :class="`cleodores-option${
          dataFile.unlocked('cleodores/church') ? '' : ' disabled'
        }`"
        :disabled="!dataFile.unlocked('cleodores/church')"
      >
        Church
      </button>
    </main>
  </section>
</template>

<script lang="ts">
import { gameData } from "../../../types.d";
import { MercGuild } from "../../gameLogic/Cleodores";

export default {
  name: "Cleodores",
  components: {
    BackButton,
  },
  props: {
    dataFile: {
      type: gameData,
      required: true,
    },
  },
  data() {
    return {
      speech: false,
    } as {
      speech: false | Array<{ speaker: string; text: string }>;
    };
  },
  methods: {
    backClick() {
      this.dataFile.backTab();
    },
    mercenaryGuildClick() {
      console.log(this.dataFile.testingtesting);
      this.speech = MercGuild(this.dataFile);
    },
    stopTalking() {
      this.speech = false;
      this.dataFile.unlock("cleodores/jobsBoard");
    },
  },
};
</script>

<style scoped>
#map-city-cleodores {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}
header {
  box-sizing: border-box;
  width: 100%;
  height: 30%;
  text-align: center;
  overflow: hidden;
}
main {
  box-sizing: border-box;
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  overflow-x: hidden;
}
.cleodores-option {
  box-sizing: border-box;
  width: min(8em, 40%);
  height: 4em;
  margin: 0.5em;
  border: 1px solid black;
  border-radius: 2em;
  background-color: rgb(139, 59, 224);
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  overflow: hidden;
}
.disabled {
  background-color: rgb(139, 59, 224, 0.5);
  color: rgb(139, 59, 224, 0.5);
  border: 1px solid rgb(139, 59, 224, 0.5);
  cursor: not-allowed;
}
</style>
