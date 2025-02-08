<template>
  <router-view></router-view>
</template>

<script>
import { ref, onMounted,onBeforeUnmount} from "vue";
import { Heartbeat } from "./api/Comon";

export default {
  name: "App",
  setup() {
    const timer = ref(0);
    const expire = ref(1000 * 60 * 3);

    onMounted(() => {
      timer.value = setInterval(async () => {
        await Heartbeat();
      }, expire.value);
    });

    onBeforeUnmount(function(){
          clearInterval(timer.value);
    });

    return {
      timer,
      expire,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
