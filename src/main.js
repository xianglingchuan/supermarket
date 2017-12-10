// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import * as ITourTechCommonsVO from 'itourtech-commons-vo';
import ITourTechComponentsCommons from 'itourtech-components-commons';
import 'element-ui/lib/theme-default/index.css';
import '../static/common.css';



Vue.config.productionTip = false


Vue.use(ElementUI);
Vue.use(ITourTechCommonsVO);
Vue.use(ITourTechComponentsCommons);

/* eslint-disable no-new */
window.topVueApplication = new Vue({
                              el: '#app',
                              router,
                              template: '<App/>',
                              components: { App }
                            });
