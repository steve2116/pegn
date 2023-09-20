<template>
  <section
    id="speechbox"
    @click="click"
  >
    <p id="speaker">{{ speaker }} :</p>
    <section id="text">
      <p id="text-p">{{ text }}</p>
      <p
        id="continue"
        :class="class"
      >
        Press to continue.
      </p>
    </section>
  </section>
</template>

<script lang="ts">
export default {
  name: "SpeechBox",
  props: {
    textCycle: {
      type: Array<{ speaker: string; text: string }>,
      required: true,
    },
    onComplete: {
      type: Function,
      required: true,
    },
  },
  beforeCreate() {
    this.timer = setInterval(() => {
      this.class = { black: "white", white: "black" }[this.class] as
        | "black"
        | "white";
    }, 1250);
  },
  unmounted() {
    clearInterval(this.timer);
  },
  data() {
    return {
      iteration: 0,
      class: "black",
      timer: 0,
    } as { iteration: number; class: "black" | "white"; timer: number };
  },
  computed: {
    speaker() {
      return this.textCycle[this.iteration].speaker;
    },
    text() {
      return this.textCycle[this.iteration].text;
    },
  },
  methods: {
    click() {
      if (this.iteration === this.textCycle.length - 1) {
        setTimeout(() => this.onComplete(), 250);
      } else {
        this.iteration++;
      }
    },
  },
};
</script>

<style scoped>
#speechbox {
  box-sizing: border-box;
  position: absolute;
  top: 4em;
  width: 100%;
  height: fit-content;
  max-height: 20vh;
  overflow: hidden;
  background-color: rgb(188, 111, 205);
  border: 3px solid black;
  border-radius: 2em;
  display: grid;
  grid-template-rows: 1fr 3fr;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5em;
  padding: 1em;
}
#speaker {
  grid-area: 1 / 1 / 2 / 4;
  margin: 0;
  width: 100%;
  font-size: 1.2em;
  font-weight: bold;
}
#text {
  box-sizing: border-box;
  grid-area: 2 / 2 / 3 / 7;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
  height: fit-content;
  max-height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: auto 1.05em;
}
#text-p {
  grid-row: 1 / 2;
  margin: 0;
  width: 100%;
  font-size: 1.1em;
}
#continue {
  grid-row: 2 / 3;
  margin: 0;
  width: 100%;
  text-align: right;
  font-size: 1.05em;
  font-style: italic;
  transition: all 1.25s ease-in-out;
}
.black {
  color: black;
}
.white {
  color: white;
}
</style>
