<template>
  <section id="game-menu">
    <BackButton
      :backTab="backClick"
      v-show="canGoBack"
    />
    <header>
      <h1>The Game!!!</h1>
      <p>
        <span class="user-info">
          <span>{{ dataFile.name }}</span>
          <span>{ {{ combatLevel }} }</span>
        </span>
        <span class="user-info">Total stats: {{ characterStats }}</span>
      </p>
    </header>
    <main>
      <button
        class="GM-button one"
        @click="dataFile.tab = 'game-maps'"
      >
        Map
      </button>
      <button
        class="GM-button two disabled"
        disabled
      >
        Arena
      </button>
      <button
        class="GM-button three disabled"
        disabled
      >
        Inventory
      </button>
      <button
        class="GM-button four"
        @click="dataFile.tab = 'character-info'"
      >
        Character Info
      </button>
      <button
        class="GM-button five"
        @click="(saveClick as Function)()"
      >
        Save Game
      </button>
      <button
        class="GM-button six disabled"
        disabled
      >
        Settings
      </button>
    </main>
  </section>
</template>

<script lang="ts">
import BackButton from "../parts/BackButton.vue";

import { gameData } from "../../types.d";

export default {
  name: "GameMenu",
  components: {
    BackButton,
  },
  props: {
    dataFile: {
      type: gameData,
      required: true,
    },
    saveClick: {
      type: Function,
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
    combatLevel() {
      const stats = this.dataFile.characterSheet.stats;
      return Math.floor(
        (stats.strength * 2 +
          stats.endurance +
          stats.agility * 2 +
          stats.perception +
          stats.intelligence +
          stats.wisdom +
          stats.charisma / 2) /
          3
      );
    },
    canGoBack(): boolean {
      const currentTab = this.dataFile.check;
      return !!currentTab && currentTab !== "game-menu";
    },
  },
  methods: {
    backClick() {
      this.dataFile.backTab();
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
  background-image: url("../assets/GM-cave.jpg");
  background-position: 55% 50%;
}
header {
  box-sizing: border-box;
  width: 100%;
  height: 22%;
  margin-bottom: 3%;
  padding: 1em;
  border-radius: 1em;
  background-color: rgba(71, 202, 121, 0.703);
}
h1 {
  font-size: 3rem;
  text-align: center;
  margin: 0;
  padding: 0;
}
header > p {
  display: flex;
  justify-content: space-between;
}
.user-info {
  font-style: italic;
  font-size: 1.1em;
}
.user-info > span {
  display: block;
  text-align: center;
}
main {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: repeat(6, 1fr);
  align-items: center;
  justify-items: center;
  width: 100%;
  height: 75%;
  padding: 1.5em;
  border: 2px solid rgba(225, 164, 72, 0.679);
  border-radius: 1em;
  background-color: rgba(250, 194, 109, 0.517);
}
.GM-button {
  box-sizing: border-box;
  width: 100%;
  height: fit-content;
  padding: 0.7em 1em 0.7em 1em;
  background-color: rgb(59, 122, 59);
  border-radius: max(100vw, 100vh);
  color: white;
  font-size: 1.2em;
  font-weight: bold;
}
.GM-button.one {
  grid-area: 1 / 2 / 2 / 3;
}
.GM-button.two {
  grid-area: 2 / 2 / 3 / 3;
}
.GM-button.three {
  grid-area: 3 / 2 / 4 / 3;
}
.GM-button.four {
  grid-area: 4 / 2 / 5 / 3;
}
.GM-button.five {
  grid-area: 5 / 2 / 6 / 3;
}
.GM-button.six {
  grid-area: 6 / 2 / 7 / 3;
}
.disabled {
  background-color: grey;
}
</style>
