<template>
  <div class="WelcomeView_top_div">
    <el-row class="breadcrumb_row">
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"><div>欢迎使用无人便利店管理系统</div></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'WelcomeView',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    
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
.WelcomeView_top_div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
}
.breadcrumb_row {
  margin-bottom: 8px;
  padding: 5px 0px 5px 3px;
  border-bottom: 1px solid #ccc;
}
</style>
