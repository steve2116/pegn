<template>
  <section id="character-info">
    <h1>Character Information</h1>
  </section>
</template>

<script lang="ts">
import { gameData } from "../../types.d";

export default {
  name: "CharacterInfo",
  props: {
    dataFile: {
      type: gameData,
      required: true,
    },
  },
};
</script>

<style scoped>
#character-info {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-image: url("../assets/CI-parchment.jpg");
  background-position: 50% 50%;
  overflow: hidden;
}
</style>
