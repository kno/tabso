import Vue from "vue";

import store from "../store/index";

import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

// function requireAuth(to, from, next) {
//   if (store.state.authentication.token) next();
//   else next("/login");
// }

function dynamicHome(to, from, next) {
  if (store.state.authentication.token) next("/dashboard");
  else next();
}

function logout(to, from, next) {
  if (store.state.authentication.token) store.dispatch("authentication/logout");
  next("/login");
}

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    beforeEnter: dynamicHome
  },
  {
    path: "/signup",
    name: "signup",
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/Register.vue")
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/logout",
    name: "logout",
    beforeEnter: logout
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
  },
  {
    path: "/deliveries",
    name: "ServiceRequest",
    component: () =>
      import(/* webpackChunkName: "servicerequest" */ "../views/Sr.vue")
  },
  {
    // catch all 404
    path: "*",
    component: () => import("../views/NotFound.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeResolve((to, from, next) => {
  if (to.name) store.set("loading", true);

  next();
});

router.afterEach(() => {
  store.set("loading", false);
});

export default router;
