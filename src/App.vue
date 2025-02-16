<template>
    <router-view />
</template>

<script setup lang="ts">
import {ref,onMounted,onBeforeUnmount} from "vue";
import { Heartbeat } from "./api/Common";

const timer = ref(0);
const expire = ref(1000 * 60 * 3);

onMounted(() => {
  timer.value = setInterval(async () => {
    await Heartbeat();
  }, expire.value);
});

onBeforeUnmount(function () {
  clearInterval(timer.value);
});

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body{
  margin: 0;
}
</style>
