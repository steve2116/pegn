<script lang="ts" setup>
import BackButton from "../../parts/BackButton.vue";
import SpeechBox from "../../parts/SpeechBox.vue";
</script>

<template>
  <section id="map-city-cleodores">
    <SpeechBox
      v-if="speech"
      :textCycle="speech"
      :onComplete="() => (speech = false)"
    />
    <BackButton :backTab="backClick" />
    <header>
      <h1>Cleodores</h1>
    </header>
    <main>
      <button
        class="cleodores-option disabled"
        disabled
      >
        Mayor's Office
      </button>
      <button
        class="cleodores-option"
        @click="mercenaryGuildClick"
        :disabled="!!speech"
      >
        Mercenary Guild
      </button>
      <button
        class="cleodores-option disabled"
        disabled
      >
        Marketplace
      </button>
      <button
        class="cleodores-option disabled"
        disabled
      >
        Guard's Tower
      </button>
      <button
        class="cleodores-option disabled"
        disabled
      >
        City Gate
      </button>
      <button
        class="cleodores-option disabled"
        disabled
      >
        Church
      </button>
    </main>
  </section>
</template>

<script lang="ts">
import { gameData } from "../../../types.d";

export default {
  name: "CityCleodores",
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
      this.speech = [
        {
          speaker: "Receptionist",
          text: "Welcome to the Mercenary Guild!",
        },
        {
          speaker: "Receptionist",
          text: "We have a variety of jobs available for you to take.",
        },
        {
          speaker: "Receptionist",
          text: "It seems you have already been signed up, so you can get started immediately.",
        },
        {
          speaker: "Receptionist",
          text: "Please take a look at our jobs board.",
        },
      ];
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
  height: 25%;
  text-align: center;
  overflow: hidden;
}
main {
  box-sizing: border-box;
  width: 100%;
  height: 75%;
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
