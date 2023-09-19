<template>
  <button
    class="back-button"
    @click="backClick"
  >
    <img
      src="../assets/arrow-head.png"
      alt="back arrow"
    />
  </button>
</template>

<script lang="ts">
import { gameData } from "../../types.d";

export default {
  name: "BackButton",
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
