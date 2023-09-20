<template>
  <section id="combat">
    <h1>Fight!</h1>
  </section>
</template>

<script lang="ts">
import { gameData } from "../../types.d";

export default {
  name: "Combat",
  props: {
    dataFile: {
      type: gameData,
      required: true,
    },
  },
};
</script>
