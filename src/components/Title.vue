<template>
  <section id="title">
    <h1>the Path of Ever Growing Numbers</h1>
    <button
      :class="buttonFlash"
      @click="enterClick"
    >
      Press to enter
    </button>
  </section>
</template>

<script lang="ts">
import { gameData } from "../../types.d";

export default {
  name: "Title",
  props: {
    dataFile: {
      type: gameData,
      required: true,
    },
  },
  data() {
    return {
      buttonFlash: "bg",
      intervalID: undefined,
    } as { buttonFlash: "bg" | "no-bg"; intervalID?: number };
  },
  created() {
    this.intervalID = setInterval(() => {
      if (this.buttonFlash === "bg") {
        this.buttonFlash = "no-bg";
      } else {
        this.buttonFlash = "bg";
      }
    }, 1500);
  },
  unmounted() {
    clearInterval(this.intervalID);
  },
  methods: {
    enterClick() {
      this.dataFile.tab = "login-menu";
    },
  },
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-image: url("../assets/title-sky.jpeg");
  background-repeat: no-repeat;
  background-position: center;
}
h1 {
  font-size: 3em;
  text-align: center;
  padding: 1em;
}
button {
  margin: 1em;
  border: none;
  padding: 1em;
  border-radius: 1.5em;
  font-weight: bold;
  font-size: 1.5em;
}
.bg {
  transition: all 1.5s ease-in-out;
  background-color: lightgray;
}
.no-bg {
  transition: all 1.5s ease-in-out;
  background-color: transparent;
}
</style>
