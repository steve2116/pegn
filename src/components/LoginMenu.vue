<template>
  <section id="login-menu">
    <h1>Choose your Character</h1>
    <form @submit.prevent>
      <label name="username"
        ><span>username: </span
        ><input
          v-model="username"
          name="username"
          autocomplete="username"
      /></label>
      <label name="password"
        ><span>password: </span
        ><input
          v-model="password"
          type="password"
          name="password"
          autocomplete="current-password"
          disabled
      /></label>
    </form>
    <section class="button-container">
      <button disabled>Login</button>
      <button disabled>Register</button>
      <button @click="playAsGuest">Play as guest</button>
      <button
        @click="playLocal"
        :disabled="localSave === null"
      >
        Local Save
      </button>
    </section>
  </section>
</template>

<script lang="ts">
import { gameData, jsonDataT } from "../../types.d";
import { fetchGameDataFiles } from "../utils";

export default {
  name: "LoginMenu",
  props: {
    dataFile: {
      type: gameData,
      required: true,
    },
    gameFiles: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      username: "",
      password: "",
      localSave: localStorage.getItem("pegn-saveData"),
    };
  },
  methods: {
    playAsGuest() {
      if (this.username.length > 2) {
        // if (this.localSave) {}
        new Promise((resolve) => {
          this.dataFile.loginGuest({ username: this.username });
          resolve(this.loadGameDataFiles());
        }).then(() => {
          this.dataFile.tab = "character-creation";
        });
      } else {
        new Promise((resolve) => {
          this.dataFile.loginGuest({ username: "Default username" });
          resolve(this.loadGameDataFiles());
        }).then(() => {
          this.dataFile.tab = "character-creation";
        });
        // alert("Username must be at least 3 characters long.");
      }
    },
    playLocal() {
      new Promise((resolve) => {
        resolve(this.loadGameDataFiles());
      })
        .then(() => this.dataFile.load(this.localSave as string))
        .then((tabReset) => {
          tabReset();
          this.dataFile.tab = "game-menu";
        });
    },
    async loadGameDataFiles() {
      this.$emit("changeLoading", true);
      const gameFiles = await fetchGameDataFiles();
      (this.gameFiles as jsonDataT).locations = gameFiles.locations;
      (this.gameFiles as jsonDataT).quests = gameFiles.quests;
      (this.gameFiles as jsonDataT).loadingMessages = gameFiles.loadingMessages;
      this.$emit("changeLoading", false);
    },
  },
  emits: ["changeLoading"],
};
</script>

<style scoped>
#login-menu {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  background-image: url("../assets/LM-window.jpg");
  background-position: 54% 73%;
  padding: 0.5em;
  overflow: hidden;
}
h1 {
  font-size: 3rem;
  margin-top: 1.5em;
  text-align: center;
}
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  width: fit-content;
  margin: auto;
  margin-top: 2em;
  margin-bottom: 2em;
  padding: 1em;
  border-radius: 1em;
  background-color: rgba(255, 255, 255, 0.5);
}
label {
  display: grid;
  grid-template-columns: 3fr 5fr;
  align-items: center;
  padding: 0 0.5em 0 0.5em;
}
label > span {
  width: 100%;
  font-size: 1.5em;
}
input {
  box-sizing: border-box;
  width: 100%;
  padding: 0.5em;
  border-radius: 0.5em;
  font-size: 1.3em;
}
.button-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin: 2em 0 2em 0;
}
button {
  box-sizing: border-box;
  width: calc(2.5em * 160 / 65);
  height: 3.5em;
  margin: 0.5em;
  padding: 0.5em;
  border-radius: 1em;
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  background-color: rgba(255, 251, 207, 0.8);
}
</style>
