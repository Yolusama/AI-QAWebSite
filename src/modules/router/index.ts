import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path:"/",
    redirect:"/Home"
  },
  {
    path:"/Home",
    name:"Home",
    component:()=>import("@/pages/AppHome.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes:routes
});

export default router;
