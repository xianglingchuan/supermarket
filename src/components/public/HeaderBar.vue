<template>
  <el-row>
    <el-col :span="24" class="header"></el-col>
  </el-row>
</template>

<script>
export default {
  name: 'HeaderBar',
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
  beforeRouteEnter (to, from, next) {

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
.header {
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #ccc;
  /*background-image:-webkit-linear-gradient(to top, #00FFFF, white); 
  background-image:linear-gradient(to top,#00FFFF, white);*/
  background-image:-webkit-linear-gradient(to top, #0E66A7, white); 
  background-image:linear-gradient(to top, #0E66A7, white);
}
</style>
