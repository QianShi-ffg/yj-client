import { createRouter } from 'vue-router'

const routes = [
  {
    path: "/",
    name: "login",
    component: () =>
      import("../views/login.vue")
  },
  {
    path: "/monitor",
    name: "monitor",
    component: () =>
      import("../views/monitor.vue"),
    children: [
      {
        path: "/chatFrame/:id",
        name: "chatFrame",
        component: () =>
          import("../components/chatFrame.vue"),
      }
    ]
  },
];

const router = createRouter({
  routes,
});

export default router;
