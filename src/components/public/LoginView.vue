<template>
  <div class="LoginView_top">
    <LoginPannel class="LoginPannel"></LoginPannel>
  </div>
</template>

<script>

import LoginPannel from '@/components/public/LoginPannel'

export default {
  name: 'LoginView',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    LoginPannel
  },
  props: {

  },
  //实例初始化最之前，无法获取到data里的数据
  beforeCreate() {

  },
  //在挂载开始之前被调用
  beforeMount() {

  },
  //已成功挂载，相当ready()
  mounted() {

  },
  //相关操作事件
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.LoginView_top {
  width: 100%;
  height: 100%;
  max-height: 100%;

  background-color: #ECECEC;
}
.LoginView_top .LoginPannel {
  position: relative;
  top: 20%;
  margin-left: auto;
  margin-right: auto;
}
.flex_item {
  flex: none;
}
</style>
