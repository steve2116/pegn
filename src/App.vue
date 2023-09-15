<script setup lang="ts">
import Title from "./components/Title.vue";
import CharacterCreation from "./components/CharacterCreation.vue";
import LoginMenu from "./components/LoginMenu.vue";
import GameMenu from "./components/GameMenu.vue";
import CharacterInfo from "./components/CharacterInfo.vue";
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

<style scoped>
#pegn {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  max-height: 1500px;
  width: 100vw;
  max-width: 2250px;
  overflow: hidden;
}
</style>
