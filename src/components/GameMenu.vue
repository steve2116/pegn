<template>
  <section id="game-menu">
    <h1>The Game!!!</h1>
    <p>
      <span class="user-info">{{ dataFile.name }}</span
      >{{ " " }}
      <span class="user-info">Total stats: {{ characterStats }}</span>
    </p>
  </section>
</template>

<script lang="ts">
import { gameData } from "../../types.d";

export default {
  name: "GameMenu",
  props: {
    dataFile: {
      type: gameData,
      required: true,
    },
  },
  computed: {
    characterStats() {
      return Object.values(this.dataFile.characterSheet.stats).reduce(
        (acc, stat) => acc + stat,
        0
      );
    },
  },
};
</script>

<style scoped>
#game-menu {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  padding: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: nowrap;
}
h1 {
  font-size: 3rem;
  text-align: center;
  margin: 0;
  padding: 0;
}
.user-info {
}
</style>
