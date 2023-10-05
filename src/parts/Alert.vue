<template><section id="alert"></section></template>

<script lang="ts">
export default {
  name: "Alert",
  props: {
    message: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
