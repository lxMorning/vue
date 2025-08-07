import Vue from "vue";
import './plugins/plugins';

import App from "./App.vue";
import router from "./router/index";
import store from "./store";

import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';

import VueI18n from 'vue-i18n';
import { messages } from './lang';

Vue.use(Viewer);
Vue.use(VueI18n);

Viewer.setDefaults({
  Options: {
    "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true,
    "tooltip": true, "movable": true, "zoomable": true, "rotatable": true,
    "scalable": true, "transition": true, "fullscreen": true,
    "keyboard": true, "url": "data-source"
  }
});

Vue.config.productionTip = false;

const i18n = new VueI18n({
  locale: localStorage.getItem('lang') || 'vi',   // ✅ 修复点
  fallbackLocale: 'en',
  messages
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
