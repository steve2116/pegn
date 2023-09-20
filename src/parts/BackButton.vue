<template>
  <button
    class="back-button"
    @click="(backTab as Function)()"
  >
    <img
      src="../assets/arrow-head.png"
      alt="back arrow"
    />
  </button>
</template>

<script lang="ts">
export default {
  name: "BackButton",
  props: {
    backTab: {
      type: Function,
      required: true,
    },
  },
};
</script>
