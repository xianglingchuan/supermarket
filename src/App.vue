<template>
  <div id="app" style="width: 100%;height: 100%;box-sizing: border-box;max-height: 100%;">
    <router-view class="top_router_view"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      viewCtrl: {
        mutationObserver: undefined, 
        checkCtrlParamTabelMaxHeightInterval: undefined, 
        screenWidth: document.body.clientWidth,
        screenHeight: document.body.clientHeight,
        resizeHandlerMap: {}
      }
    }
  },
  components: {
    
  },
  props: {
    
  },
  //实例初始化最之前，无法获取到data里的数据
  beforeCreate() {

  },
  created: function () {
    
  },
  //在挂载开始之前被调用
  beforeMount() {

  },
  //已成功挂载，相当ready()
  mounted() {
    const self = this
    // ================== 基于resize事件监听的实现方案 start ================================
    var resize_handler = function() {
      //TODO 优化性能
      self.viewCtrl.screenWidth = document.body.clientWidth;
      self.viewCtrl.screenHeight = document.body.clientHeight;
      var resizeHandlerMap = self.viewCtrl.resizeHandlerMap;
      for (var key in resizeHandlerMap) {
        if (resizeHandlerMap[key]) {
          resizeHandlerMap[key]();
        } else {
          if (resizeHandlerMap.hasOwnProperty(key)) {
            delete resizeHandlerMap[key];
          }
        }
      }
    };
    window.onresize = resize_handler;
    // setTimeout(resize_handler);
  },
  beforeUpdate: function () {
    
  }, 
  updated: function () {
    
  }, 
  beforeDestroy: function () {
    
  },
  destroyed: function () {
      window.onresize = null;
  },
  //相关操作事件
  methods: {
    
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.top_router_view {
	width: 100%;
	height: 100%;
  max-height: 100%;
}
.el-col {
    height: 100%;
}
</style>
