import { createRouter, createWebHistory } from "vue-router";

import type { RouteRecordRaw } from "vue-router";

import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import SpeechDataTable from "./views/SpeechDataTable.vue";
import Modal from "./views/speech_data/NewTTSData.vue";
//import RepDataTable from "./views/RepDataTable.vue";
//import MLModel from "./views/MLModel.vue";

//import Forms from "./views/Forms.vue";
//import Tables from "./views/Tables.vue";
//import UIElements from "./views/UIElements.vue";
//import Modal from "./views/Modal.vue";
//import Documents from "./views/Documents.vue";
//import Card from "./views/Card.vue";
//import Blank from "./views/Blank.vue";
//import NotFound from "./views/NotFound.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { layout: "empty" },
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/speech_data",
    name: "Speech Data",
    component: SpeechDataTable,
  },
  {
    path: "/modal",
    name: "Modal",
    component: Modal,
  },
  //  {
  //    path: "/model",
  //    name: "MLModel",
  //    component: MLModel,RouteRecordRaw' is a type and must be imported using a type-only import when 'preserveValueImports' and 'isolatedModules' are both enabled.
  //  },
  //  {
  //    path: "/documents",
  //    name: "Documents",
  //    component: Documents,
  //  },
  //  {
  //    path: "/forms",
  //    name: "Forms",
  //    component: Forms,
  //  },
  //  {
  //    path: "/cards",
  //    name: "Cards",
  //    component: Card,
  //  },
  //  {
  //    path: "/ui-elements",
  //    name: "UIElements",
  //    component: UIElements,
  //  },
  //  {
  //    path: "/modal",
  //    name: "Modal",
  //    component: Modal,
  //  },
  //  {
  //    path: "/blank",
  //    name: "Blank",
  //    component: Blank,
  //  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
