<template>
  <div id="pegn">
    <div
      id="saving-game"
      :class="savingDiv"
    >
      Saving
    </div>
    <!-- main screens -->
    <Title
      v-if="currentTab === 'title'"
      :data-file="(dataFile as gameData)"
    />
    <LoginMenu
      v-if="currentTab === 'login-menu'"
      :data-file="(dataFile as gameData)"
      :game-files="(gameFiles as jsonDataT)"
      @change-loading="changeLoading"
    />
    <CharacterCreation
      v-if="currentTab === 'character-creation'"
      :data-file="(dataFile as gameData)"
    />
    <GameMenu
      v-if="currentTab === 'game-menu'"
      :data-file="(dataFile as gameData)"
      :save-click="saveClick"
    />
    <CharacterInfo
      v-if="currentTab === 'character-info'"
      :data-file="(dataFile as gameData)"
    />
    <GameMaps
      v-if="currentTab === 'game-maps'"
      :data-file="(dataFile as gameData)"
    />
    <!-- loading -->
    <LoadingScreen
      v-if="loading"
      :message="loadingMessage"
    />
    <!-- maps -->
    <Cleodores
      v-if="currentTab === 'map-city-cleodores'"
      :data-file="(dataFile as gameData)"
      :game-files="(gameFiles as jsonDataT)"
    />
  </div>
</template>

<script lang="ts">
import Title from "./components/Title.vue";
import CharacterCreation from "./components/CharacterCreation.vue";
import LoginMenu from "./components/LoginMenu.vue";
import GameMenu from "./components/GameMenu.vue";
import CharacterInfo from "./components/CharacterInfo.vue";
import GameMaps from "./components/GameMaps.vue";
import Cleodores from "./maps/cities/Cleodores.vue";
import LoadingScreen from "./components/LoadingScreen.vue";

import { gameData, jsonDataT } from "../types.d";

export default {
  name: "App",
  components: {
    Title,
    LoginMenu,
    CharacterCreation,
    GameMenu,
    CharacterInfo,
    GameMaps,
    Cleodores,
    LoadingScreen,
  },
  data() {
    return {
      dataFile: new gameData(),
      saving: false,
      saveDivCounter: 0,
      gameFiles: {},
      loading: false,
      timer: 0,
      loadingMessage: "Loading all your juicy game data 😋",
    } as {
      dataFile: gameData;
      saving: boolean;
      saveDivCounter: number;
      gameFiles: jsonDataT | Record<string, never>;
      loading: boolean;
      timer: number;
      loadingMessage: string;
    };
  },
  computed: {
    currentTab() {
      return this.dataFile.tab;
    },
    savingDiv() {
      return this.saving ? "saving" : "not-saving";
    },
  },
  methods: {
    saveClick() {
      if (!this.saving && this.saveDivCounter === 0) {
        this.saving = true;
        // console.log("Saving...");
        const savedFile = this.dataFile.save();
        const timer = setInterval(() => {
          if (this.saveDivCounter > 2) {
            localStorage.setItem("pegn-saveData", savedFile);
            this.saving = false;
            // console.log("This is your save file: ", savedFile);
            clearInterval(timer);
            this.saveDivCounter = 0;
            return;
          }
          this.saving = !this.saving;
          this.saveDivCounter++;
        }, 750);
      }
    },
    changeLoading(e: boolean) {
      if (
        e &&
        Object.prototype.hasOwnProperty.call(this.gameFiles, "loadingMessages")
      ) {
        const allMessages = this.gameFiles.loadingMessages.dyk.concat(
          this.gameFiles.loadingMessages.tips,
          this.gameFiles.loadingMessages.funFact
        );
        const total = allMessages.length;
        this.loadingMessage =
          allMessages[Math.round(Math.random() * (total - 1))];
      }
      this.loading = e;
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
#saving-game {
  position: absolute;
  top: 1em;
  right: 1em;
  font-size: 1.5em;
  font-weight: bold;
  padding: 0.5em;
  border-radius: 1em;
}
.saving {
  border: 1px solid rgb(187, 187, 187);
  background-color: rgb(227, 227, 227);
  transition: all 0.75s ease-in-out;
}
.not-saving {
  color: transparent;
  background-color: transparent;
  border: 2px solid transparent;
  transition: all 0.75s ease-in-out;
}
</style>
