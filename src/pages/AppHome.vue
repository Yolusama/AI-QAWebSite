<template>
  <div id="home">
    <el-menu :router="true" mode="vertical" 
           :default-active="route.path" 
           class="main-menu"
        active-text-color="rgb(0,125,235)"
        background-color="#545c64"
        text-color="white"
        >
        <el-menu-item :index="state.routes['user']">
           <el-icon><Avatar /></el-icon>用户管理
        </el-menu-item>
        <el-menu-item :index="state.routes['version']">
            <el-icon><Tools /></el-icon>版本控制管理
        </el-menu-item>
         <el-menu-item :index="state.routes['userInfo']">
           <el-icon><User></User></el-icon>个人信息
        </el-menu-item>
        <el-menu-item @click="logout">
            <el-icon><Operation /></el-icon>退出登录
        </el-menu-item>
    </el-menu>
    <div class="content">
         <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import { Logout } from "@/api/User";
import { BeforeRouteLeave } from "@/modules/Common";
import Route from "@/modules/Route";
import stateStroge from "@/modules/StateStorage";
import { reactive,onMounted } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";

const route = useRoute();
const state = reactive({
    routes:{},
    hasLogouted:false
});

onMounted(function(){
    state.routes['user'] = "/Home/UserManage";
    state.routes['version'] = "/Home/VersionManage";
    state.routes['userInfo'] = "/Home/UserInfo";
});

onBeforeRouteLeave(function(to,from,next){
   BeforeRouteLeave(to,from,next,state.hasLogouted);
});

async function logout(){
  const user = stateStroge.get("user");
  await Logout(user.id,user.email,()=>{
       stateStroge.clear();
       state.hasLogouted = true;
       Route.switch("#/Login");
    });
}

</script>
<style scoped>
  #home
  {
    position: relative;
    width: 100%;
    display: flex;
  }
  #home .main-menu
  {
    width: 220px;
    height: 660px;
  }
</style>