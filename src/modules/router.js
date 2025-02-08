import { createRouter,createWebHashHistory } from "vue-router";
import Route from "./Route";
import AppHome from "@/pages/AppHome.vue";


const routes=[];
routes.push(new Route("/").redirectTo("/Home"));
const home = new Route("/Home","Home",AppHome);
routes.push(home);
const router=createRouter({
       routes:routes,
       history:createWebHashHistory()
});

export default router;