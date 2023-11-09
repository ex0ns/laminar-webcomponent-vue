<template>
  <div class="embedded">
    <ul>
      <li>I'm inside a slot</li>
      <li>And this is great</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: { },
  emits: ["change"],
  data() { },
  watch: { }
};
</script>

<style scoped>
.embedded {
  font-size: 2.3em;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
</style>
