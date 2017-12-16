<template>
  <div class="SettleIndexView_top_div">
    <HGroup v-if="step === 1" height="100%" padding="0px" justify="center" align="center">
       <img width="100%" height="100%" :src="'./static/img/verify_fail.png'">
    </HGroup>
    <HGroup v-else height="100%" padding="0px">
      <div style="width: 100%; height: 100%;">
        <el-carousel indicator-position="none" arrow="never" :interval="5000" trigger="click" width="100%" style="height: 100%;">
          <el-carousel-item v-for="item in carouselItems" :key="item">
            <img width="100%" height="100%" :src="'./static/img/'+item">
          </el-carousel-item>
        </el-carousel>
      </div>
    </HGroup>
  </div>
</template>




<script>

  export default {
    name: 'SettleIndexView',
    data () {
      return {
        carouselItems: [
          'verify_success.png',
          'verify_success.png',
        ],
        readInterval: 10,
        step: undefined,
        //step: 2,
        lastCacheOrderDate: undefined,
        qrcode: undefined,
        epcMap: {},
        productData:{   /* 订单商品列表数据集 */
          list:[],
          orderNumber : "",
        },
        viewCtrl: {
          mainTabelMaxHeight: 200,
        },
        storeId : 4, /* 当前门店的ID号 */
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
      console.log("mounted......");
      var result = ipc.sendSync('synchronous-message', 'SoonkeReader_Connect');
      console.log("mounted......result:"+result);
      if (result.ret >= 0) {
        //result = ipc.sendSync('synchronous-message', 'SoonkeReader_StartInventoryMultiple');
        console.log("mounted......result2:"+result);
        //if (result.ret >= 0) {
          this.InventoryMultipleRunning = true;
          this.InventoryMultipleData();
        //}
      }
      //this.InventoryMultipleData();
    },


    beforeUpdate: function () {

    },
    updated: function () {

    },
    beforeDestroy: function () {
      //this.StopInventoryMultiple();
    },
    destroyed: function () {

    },
    computed: {

    },
    //相关操作事件
    methods: {
      /*  订单提交服务器方法  */
      verifyProduct(param) {
        let self = this;
        //var url = 'http://localhost:8888/supermarket/api/product/createOrder';
        //var url = 'http://192.168.11.246:8888/supermarket/api/product/verifyProduct';
        var url = "http://106.14.64.145/supermarket/api/product/verifyProduct";
        //var url = 'http://192.168.12.9:8888/supermarket/api/product/verifyProduct';
        console.log("提交订单内容====="+JSON.stringify(param));
        axios.post(url, param)
          .then(function (response) {
            console.log(response);
            var result = response.data;
            console.log("createOrder.result---->"+JSON.stringify(result));
            //请求数据正常
            if(result.ret == 1){
              var oldOrderId = self.productData.orderNumber;
              var newOrderId = undefined;
              if (result.data.productData && result.data.productData.length >=1) {
                   //存在未支付订单
                   console.log("存在未支付商品");
                   //开始警报
                   //ipc.sendSync('synchronous-message', 'SoonkeReader_StartWarning');
                   //2秒以后关闭警报
                   //ipc.sendSync('synchronous-message', 'SoonkeReader_StopWarning');
                   self.step = 1;
              }else{
                  //不存在未支付订单
                  console.log("不存在未支付订单");
                  self.step = 0;
              }
              if (self.InventoryMultipleRunning) {
                console.log("要求循环读取信息.......01");
                setTimeout(self.InventoryMultipleData, self.readInterval);
              }
            }else{


              if (self.InventoryMultipleRunning) {
                console.log("要求循环读取信息.......02");
                setTimeout(self.InventoryMultipleData, self.readInterval);
              }


//              console.log("请求数据异常,"+result.message);
//              self.productData = {
//                list: [],
//                orderNumber : "",
//              };
//              self.step = 3;//没有返回订单，则转到欢迎页



            }
          })
          //请求异常
          .catch(function (error) {
            console.log(error);
            if (self.InventoryMultipleRunning) {
              console.log("要求循环读取信息.......03");
              setTimeout(self.InventoryMultipleData, self.readInterval);
            }
          });
      },


      /*  多条数据处理  */
      InventoryMultipleData() {
        var result = ipc.sendSync('synchronous-message', 'SoonkeReader_InventoryMultipleData');
        //setTimeout(this.InventoryMultipleData, this.readInterval);
        //return;
        console.log("InventoryMultipleData.result1------>:"+JSON.stringify(result));
        //var result = {ret:1,epcs:["10000000002","10000000001","10000000003","10000000004","AD003064"]};
        //result = {ret:1,epcs:["AD003070","AD003071","AD003072","AD003073","AD003074","AD003075","AD003076","AD003077",  "1111"]};
        console.log("InventoryMultipleData.result2------>:"+JSON.stringify(result));
        if (result.epcs && result.epcs.length > 0) {
          for (var i = result.epcs.length - 1; i >= 0; i--) {
            let epcId = result.epcs[i];
            if ('000000000000000000000000' === epcId) {
              continue;
            }
            this.epcMap[epcId] = new Date().getTime();
          }
          console.log("result.epcs.length======"+result.epcs.length);
          console.log("this.epcMap.length======"+this.epcMap.length);
        }
        console.log("2222222");
        console.log("this.lastCacheOrderDate:"+this.lastCacheOrderDate)

        console.log("3333333");
        let epcs = [];
        for (var epc in this.epcMap) {
          //只保留两秒以内扫描到的RFID,如果为两秒以前扫描出来的,直接删除
          var diffDate = new Date().getTime() - this.epcMap[epc];
          console.log("diffDate===="+diffDate+",RFID:"+epc);
          if (new Date().getTime() - this.epcMap[epc] < 1000) {
            epcs.push(epc);
          } else {
            delete this.epcMap[epc];
          }
        }
        console.log("epcs.length------->:"+epcs.length);
        //如果读取出来RFID长度大于0时
        if (epcs.length > 0) {
          //如果当前获取的订单商品列表为0,开始重新请求网络下订单
          if (this.productData.list.length == 0) {
            //缓存新订单
            let param = {
              orderNumber: '',
              rfids: epcs,
              storeId: this.storeId,
            };
            this.lastCacheOrderDate = new Date();
            this.verifyProduct(param);
            //setTimeout(this.InventoryMultipleData, self.readInterval);
          } else {
            //重校验订订单
            let param = {
              orderNumber: this.productData.orderNumber,
              rfids: epcs,
              storeId: this.storeId,
            };
            this.lastCacheOrderDate = new Date();
            this.verifyProduct(param);
            //setTimeout(this.InventoryMultipleData, self.readInterval);
          }
        } else {
          this.productData = {
            list: [],
            orderNumber : "",
          };
          this.step = 3;//没有扫描到商品，则转到欢迎页
          if (this.InventoryMultipleRunning) {
            console.log("要求循环读取信息.......04");
            setTimeout(this.InventoryMultipleData, self.readInterval);
          }
        }
      },

      /*  停止数据处理  */
      StopInventoryMultiple() {
        this.InventoryMultipleRunning = false;
        var result = ipc.sendSync('synchronous-message', 'SoonkeReader_StopInventoryMultiple');
        while (result.ret < 0) {
          result = ipc.sendSync('synchronous-message', 'SoonkeReader_StopInventoryMultiple');
        }
        ipc.sendSync('synchronous-message', 'SoonkeReader_Disconnect');
      }
    }
  }
</script>
<style type="text/css">
  .el-carousel__container {
    height: 100% !important;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .SettleIndexView_top_div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    max-height: 100%;
  }
  .SettleIndexView_top_div .el-carousel__container {
    height: 100% !important;
  }
  .top_div_left_and_body {
    flex:1 1 auto;
    height: 1px;
    max-height: 100%;
  }
  .top_div_left_and_body .el-row,.el-col {
    height: 100%;
    max-height: 100%;
  }
  .left_and_body_row_left_col {
    height: 100%;
    max-height: 100%;
  }
  .el-menu {
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
  }
</style>
