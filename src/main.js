// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
// import BootstrapVue from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(VueLazyLoad,{
  loading: "/static/loading-svg/loading-balls.svg"
});
Vue.use(infiniteScroll);
// Vue.use(BootstrapVue);
/* eslint-disable no-new */
import './assets/css/base.css'
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
