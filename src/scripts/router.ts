import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/Signaling",
    name: "Signaling",
    component: () => import("../components/GameSignaling/Signaling.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
