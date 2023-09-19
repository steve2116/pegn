<script lang="ts" setup>
import BackButton from "../parts/BackButton.vue";
</script>

<template>
  <section id="game-maps">
    <BackButton :dataFile="dataFile" />
    <header>
      <h1>Map</h1>
      <section id="map-key">
        <span>
          <div
            id="key-city"
            class="map-key-item"
          />
          City
        </span>
      </section>
    </header>
    <main>
      <button class="city">Cleodores</button>
    </main>
  </section>
</template>

<script lang="ts">
import { gameData } from "../../types.d";

export default {
  name: "GameMaps",
  props: {
    dataFile: {
      type: gameData,
      required: true,
    },
  },
};
</script>

<style scoped>
/* 
    -webkit-transform: scale(1.5);
    -moz-transform: scale(1.5);
    -o-transform: scale(1.5);
    -ms-transform: scale(1.5);
    transform: scale(1.5);
 */
#game-maps {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  background-image: url("../assets/CI-parchment.jpg");
  background-position: 50% 50%;
  overflow: hidden;
}
header {
  box-sizing: border-box;
  width: 100%;
  height: 25%;
  overflow: hidden;
}
h1 {
  font-size: 2rem;
  text-align: center;
  margin: 1em 0 0 0;
  padding: 0;
}
main {
  box-sizing: border-box;
  width: 100%;
  height: 75%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.city {
  width: min(50vw, 50vh);
  height: min(50vw, 50vh);
  border-radius: 2em;
  background-color: rgba(71, 202, 121);
  font-size: 1.5em;
  font-weight: bold;
  color: white;
  box-shadow: 0 0 0.5em black;
}
#map-key {
  box-sizing: border-box;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 1em;
  text-align: center;
}
.map-key-item {
  width: 2em;
  height: 2em;
  border-radius: 35%;
  border: 3px solid black;
}
#key-city {
  background-color: rgba(71, 202, 121);
}
</style>
