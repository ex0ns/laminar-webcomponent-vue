<template>
  <div class="container">
    <div class="somethingelse">
      <slot name="header">Missing header</slot>
      <span>Right before the slot</span>
      <slot name="default">default slot default content</slot>
      <span>Right after the slot</span>
      <slot name="footer">Missing footer</slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
    }
  },
  created() {
    console.log(this.name);
    console.log("created");
  }
}
</script>

<style scoped>
.container {
  font-size: 2em;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
</style>
