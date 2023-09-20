<script lang="ts" setup>
import BackButton from "../parts/BackButton.vue";
</script>

<template>
  <section id="character-info">
    <BackButton :backTab="backClick" />
    <header>
      <h1>Character Information</h1>
    </header>
    <main>
      <section>
        <h2>Attributes</h2>
        <ul>
          <li
            class="CI-attr-item"
            v-for="stat in Object.entries(dataFile.characterSheet.stats)"
          >
            <span>{{ stat[0] }}</span
            ><span>: {{ stat[1] }}</span>
          </li>
        </ul>
      </section>
      <section></section>
    </main>
  </section>
</template>

<script lang="ts">
import { gameData } from "../../types.d";

export default {
  name: "CharacterInfo",
  components: {
    BackButton,
  },
  props: {
    dataFile: {
      type: gameData,
      required: true,
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
@import url("https://fonts.googleapis.com/css2?family=Macondo&display=swap");
#character-info {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-image: url("../assets/CI-parchment.jpg");
  background-position: 50% 50%;
  overflow-y: hidden;
  overflow-x: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  font-family: cursive;
}
header {
  width: 100%;
  height: 18%;
}
h1 {
  text-align: center;
  font-size: 3em;
  margin: 0.5em 0 0;
}
main {
  width: 100%;
  height: 82%;
  padding-top: 0.5em;
  font-family: "Macondo", cursive;
}
h2 {
  font-size: 1.5em;
  margin: 0.5em 0;
}
ul {
  font-size: 1.3em;
  margin: 0;
}
.CI-attr-item {
  display: grid;
  grid-template-columns: 1fr 2fr;
}
</style>
