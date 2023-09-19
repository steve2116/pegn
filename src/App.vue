<script setup lang="ts">
import Title from "./components/Title.vue";
import CharacterCreation from "./components/CharacterCreation.vue";
import LoginMenu from "./components/LoginMenu.vue";
import GameMenu from "./components/GameMenu.vue";
import CharacterInfo from "./components/CharacterInfo.vue";
import GameMaps from "./components/GameMaps.vue";
</script>

<template>
  <div id="pegn">
    <Title
      v-if="currentTab === 'title'"
      :dataFile="(dataFile as gameData)"
    />
    <LoginMenu
      v-if="currentTab === 'login-menu'"
      :dataFile="(dataFile as gameData)"
    />
    <CharacterCreation
      v-if="currentTab === 'character-creation'"
      :dataFile="(dataFile as gameData)"
    />
    <GameMenu
      v-if="currentTab === 'game-menu'"
      :dataFile="(dataFile as gameData)"
    />
    <CharacterInfo
      v-if="currentTab === 'character-info'"
      :dataFile="(dataFile as gameData)"
    />
    <GameMaps
      v-if="currentTab === 'game-maps'"
      :dataFile="(dataFile as gameData)"
    />
  </div>
</template>

<script lang="ts">
import { gameData } from "../types.d";

export default {
  name: "App",
  components: {
    Title,
    LoginMenu,
    CharacterCreation,
    GameMenu,
    CharacterInfo,
    GameMaps,
  },
  data() {
    return {
      dataFile: new gameData(),
    };
  },
  computed: {
    currentTab() {
      return this.dataFile.tab;
    },
  },
};
</script>

<style>
#pegn {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  max-height: 1500px;
  width: 100vw;
  max-width: 2250px;
  overflow: hidden;
  font-size: calc(1.5vh + 1.5vw);
}
.back-button {
  position: absolute;
  top: 1em;
  left: 1em;
  border-radius: 1em;
  cursor: pointer;
  background: rgba(207, 155, 82, 0.708);
}
.back-button > img {
  background: transparent;
  height: calc(2em * 342 / 317);
  width: 2em;
}
</style>
