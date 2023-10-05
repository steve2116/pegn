<template>
  <section id="loading-screen">
    <h1>
      Loading<span>{{ dots }}</span>
    </h1>
    <h2>Please wait</h2>
    <p v-if="!!message">{{ message }}</p>
  </section>
</template>

<script lang="ts">
export default {
  name: "LoadingScreen",
  props: {
    message: String,
  },
  data() {
    return {
      dots: "",
      timer: 0,
    };
  },
  mounted() {
    this.timer = setInterval(() => {
      this.dots = {
        "": ".",
        ".": "..",
        "..": "...",
        "...": "",
      }[this.dots] as string;
    }, 600) as unknown as number;
  },
  unmounted() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
#loading-screen {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  gap: 1em;
  padding: calc(5vw + 5vh);
  border-radius: 5em;
}
#loading-screen > * {
  margin: 0;
  padding: 0;
  border: 0;
}
h1 {
  font-size: 3.5em;
}
h2 {
  font-size: 2em;
}
p {
  font-size: 1.25em;
}
span {
  position: absolute;
}
</style>
