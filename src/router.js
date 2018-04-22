import VueRouter from "vue-router"
import QuakeMap from "./components/Map.vue";
import NotFound from "./components/NotFound.vue";
import HasError from "./components/HasError.vue";

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: QuakeMap, name: 'map' },
    { path: "/error", component: HasError, name: 'hasError' },
    { path: "*", component: NotFound, name: 'notFound' }
  ]
});

export default router;