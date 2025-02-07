import { createRouter,createWebHashHistory } from "vue-router";
import Route from "./Route";
import LoginView from "@/pages/LoginView.vue";
import AppHome from "@/pages/AppHome.vue";
import UserManage from "@/pages/UserManage.vue";
import VersionManage from "@/pages/VersionManage.vue";


const routes=[];
routes.push(new Route("/").redirectTo("/Login"));
routes.push(new Route("/Login","Login",LoginView));
const home = new Route("/Home","Home",AppHome);
home.addSubRoute(new Route("/Home/UserManage","UserManage",UserManage));
home.addSubRoute(new Route("/Home/VersionManage","VersionManage",VersionManage));
routes.push(home);
const router=createRouter({
       routes:routes,
       history:createWebHashHistory()
});

export default router;