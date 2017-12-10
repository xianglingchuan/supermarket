import Vue from 'vue'
import Router from 'vue-router'
import LoginView from '@/components/public/LoginView'
import WelcomeView from '@/components/public/WelcomeView'
import SettleIndexView from '@/components/settle/SettleIndexView'
import SettleVerifyView from '@/components/settle/SettleVerifyView'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/settle/index',
      component: SettleIndexView,
    },
    {
    path: '/settle/verify',
    component: SettleVerifyView,
  }]
})
