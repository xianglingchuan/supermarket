<template>
  <div class="SettleIndexView_top_div">
      <HGroup v-if="step === 1" height="100%" padding="0px">
        <VGroup width="80%" padding="0px">
          <HGroup justify="center" align="center" style="height: 100px;">
            <span style="color: blue;font-size: 24px;">商品清单</span>
          </HGroup>
          <HGroup justify="center" width="100%">
            <el-table ref="mainTable"  :data="productData.list" border stripe fit :max-height="viewCtrl.mainTabelMaxHeight">
              <el-table-column prop="id" label="No." width="61" align="center">
                <template scope="scope">
                  <span>{{scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="productName" label="商品名称" min-width="200"></el-table-column>
              <el-table-column prop="price" label="商品单价（元）" align="right" width="100"></el-table-column>
              <el-table-column prop="count" label="商品数量（件）" align="right" width="100"></el-table-column>
              <el-table-column prop="countPrice" label="商品总价（元）" align="right" width="100"></el-table-column>
            </el-table>
          </HGroup>
          <VSpacer height="100%"></VSpacer>
          <HGroup height="100px" padding="0px">
            <VGroup width="50%" height="100%" justify="center" padding="0px">
              <div style="width: 100%;height: 100%;background: url(./static/img/tip_left.jpg) center center;background-size: cover;"></div>
            </VGroup>
            <VGroup width="50%" height="100%" justify="center" padding="0px 0px 0px 30px" style="background-color: #2459a7;color: white;font-weight: bold;">
              <HGroup align="baseline">
                <span>实需付款：￥</span>
                <span>{{productData.countMoney}}</span>
              </HGroup>
              <VSpacer height="5px"></VSpacer>
              <HGroup align="baseline">
                <span>已优惠：￥</span>
                <span>0.00</span>
                <HSpacer width="100px"></HSpacer>
                <span>商品件数：</span>
                <span>{{productData.totalProductNum}}</span>
                <span>件</span>
              </HGroup>
            </VGroup>
          </HGroup>
        </VGroup>



        <VGroup width="20%" justify="center" align="center">
            <span>扫码支付</span>
            <VSpacer height="8px"></VSpacer>
            <div id="qrcode"></div>
            <VSpacer height="8px"></VSpacer>
            <div>
              <span>使用</span><span style="color: red;">微信</span><span>扫码支付</span>
            </div>
            <VSpacer height="150px"></VSpacer>
        </VGroup>
      </HGroup>
      <HGroup v-else-if="step === 2" height="100%" justify="center" align="center">
        <img width="100%" height="100%" :src="'./static/img/pay_finish.png'">
      </HGroup>
      <HGroup v-else height="100%" padding="0px">
        <div style="width: 100%; height: 100%;">
          <el-carousel indicator-position="none" arrow="never" :interval="5000" trigger="click" width="100%" style="height: 100%;">
            <el-carousel-item v-for="item in carouselItems" :key="item">
              <img width="100%" height="100%" :src="'./static/img/'+item">
            </el-carousel-item>
          </el-carousel>
        </div>
        <!--<VGroup width="20%" justify="center" align="center">-->
          <!--<img width="100%" height="100%" :src="'./static/img/operate_flow.jpg'">-->
        <!--</VGroup>-->
      </HGroup>
  </div>
</template>




<script>

export default {
  name: 'SettleIndexView',
  data () {
    return {
      carouselItems: [
        'carousel7.png',
        'carousel8.png',
      ],
      readInterval: 1000,
      //step: undefined,
      step: 1,
      lastCacheOrderDate: undefined,
      qrcode: undefined,
      epcMap: {},
      productData:{   /* 订单商品列表数据集 */
          list:[],
          orderNumber : "",
      },
      viewCtrl: {
        mainTabelMaxHeight: 600,
      },
      storeId : 4, /* 当前门店的ID号 */
      epcsFailCount : 0, /* RFID记录返回为空的次数 */
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
      result = ipc.sendSync('synchronous-message', 'SoonkeReader_StartInventoryMultiple');
      console.log("mounted......result2:"+result);
      if (result.ret >= 0) {
        this.InventoryMultipleRunning = true;
        this.InventoryMultipleData();
      }
    }
    //this.InventoryMultipleData();
  },


  beforeUpdate: function () {

  },
  updated: function () {

  },
  beforeDestroy: function () {
    this.StopInventoryMultiple();
  },
  destroyed: function () {

  },
  computed: {

  },
  //相关操作事件
  methods: {

    /*  订单提交服务器方法  */
    cacheOrder(param) {
      let self = this;
      //var url = 'http://localhost:8888/supermarket/api/product/createOrder';
      //var url = 'http://192.168.12.9:8888/supermarket/api/product/createOrder';
      //var url = "http://106.14.64.145/supermarket/api/product/createOrder";
      var url = "http://test.pigbanker.com/supermarket/api/product/createOrder";
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
               if (result.data.productData) {
                  newOrderId = result.data.productData.orderNumber;
               }
               console.log("oldOrderId======"+oldOrderId);
               console.log("newOrderId======"+newOrderId);
               self.productData = result.data.productData;
               if (self.productData) {
                  //如果订单列表为空,并且不是支付成功的状态
                  if (self.productData.list.length == 0  &&  self.productData.orderStatus != 3) {
                     self.productData = {
                       list: [],
                       orderNumber : "",
                     };
                     self.step = 3;//没有返回订单，则转到欢迎页
                  } else {
                     self.step = 1; //目前自行添加上的
                     //如果当前订单已经结算成功
                     console.log("orderStatus======>"+self.productData.orderStatus)
                     if (self.productData.orderStatus === 3) {//已结算
                       self.step = 2;
                       setTimeout(() => {
                           if (self.step === 2) {
                             self.step = 3;
                             self.productData = {
                               list: [],
                               orderNumber : "",
                             };
                           }
                       }, 10000); //当支付成功以后,暂待10秒在进行下一次读取
                    } else {
                        //订单为其它的支付状态
                        console.log("self.step======"+self.step);
                        //if (self.step !== 1) {
                          self.step = 1;
                          console.info("newOrderId=="+newOrderId+", oldOrderId=="+oldOrderId);
                          if (newOrderId && newOrderId !== oldOrderId) {
                            console.log("开始生成支付二维码信息.....");
                            setTimeout(() => {
                              var el = document.getElementById("qrcode");
                              if (el) {
                                el.innerHTML = '';
                                let appid = "wxc716747988944fe0";
                                let redirect_uri = "http://test.pigbanker.com/supermarket/pay/wechatPay/scan?orderNumber="+newOrderId;
                                var textUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+redirect_uri+'&response_type=code&scope=snsapi_userinfo&state='+newOrderId+'#wechat_redirect';
                                console.log("textUrl--->"+textUrl);
                                self.qrcode = new QRCode(el, {
                                  // text: window.location.protocol+'//'+window.location.host+"/frontend/#/settle/index/PreparePayView?orderId=" + newOrderId,
                                  //text: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=${newOrderId}#wechat_redirect`,
                                  text:'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+redirect_uri+'&response_type=code&scope=snsapi_userinfo&state='+newOrderId+'#wechat_redirect',
                                  width: 200,
                                  height: 200,
                                  colorDark : "#000000",
                                  colorLight : "#ffffff",
                                  correctLevel : QRCode.CorrectLevel.H
                                });
                              }
                            });
                          }
                        //}
                    }
                  }
                } else {
                  self.productData = {
                     list: [],
                     orderNumber : "",
                  };
                  self.step = 3;//没有返回订单，则转到欢迎页
                }
                if (self.InventoryMultipleRunning) {
                   console.log("要求循环读取信息.......01");
                   setTimeout(self.InventoryMultipleData, self.readInterval);
                }
            }else{
                console.log("请求数据异常,"+result.message);
                self.productData = {
                  list: [],
                  orderNumber : "",
                };
                self.step = 3;//没有返回订单，则转到欢迎页
            }
        })
        //请求异常
        .catch(function (error) {
            console.log(error);
            if (self.InventoryMultipleRunning) {
              console.log("要求循环读取信息.......02");
              setTimeout(self.InventoryMultipleData, self.readInterval);
            }
        });
    },


    /*  多条数据处理  */
    InventoryMultipleData() {
      //var result = ipc.sendSync('synchronous-message', 'SoonkeReader_InventoryMultipleData');
      console.log("InventoryMultipleData.result1------>:"+JSON.stringify(result));
      //var result = {ret:1,epcs:["10000000002","10000000001","10000000003","10000000004","1111"]};
      var result = {ret:1,epcs:["AD003070","AD003071","AD003072","AD003073","AD003074","AD003075","AD003076","AD003081",  "1111"]};
      //console.log("InventoryMultipleData.result2------>:"+JSON.stringify(result));
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
      /*if (!this.lastCacheOrderDate) {
           console.log("lastCacheOrderData is null");
           this.lastCacheOrderDate = new Date();
           console.log("this.lastCacheOrderDate======="+this.lastCacheOrderDate);
           console.log("this.InventoryMultipleRunning====="+this.InventoryMultipleRunning);
           if (this.InventoryMultipleRunning) {
              console.log("要求循环读取信息.......03");
              setTimeout(this.InventoryMultipleData, this.readInterval);
           }
           //return;
      } else {
          //当前时间减去上次请求时间小于2秒时
          if (new Date().getTime() - this.lastCacheOrderDate < 2000) {
             if (this.InventoryMultipleRunning) {
                console.log("要求循环读取信息.......04");
                setTimeout(this.InventoryMultipleData, this.readInterval);
             }
             return;
          } else {
             // 将在2秒钟内收集到的EPC发送到后台检测
          }
      }*/

      console.log("3333333");
      let epcs = [];
      for (var epc in this.epcMap) {
          //只保留两秒以内扫描到的RFID,如果为两秒以前扫描出来的,直接删除
          var diffDate = new Date().getTime() - this.epcMap[epc];
          console.log("diffDate===="+diffDate+",RFID:"+epc);
          if (new Date().getTime() - this.epcMap[epc] < 2000) {
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
               this.cacheOrder(param);
          } else {
               //重校验订订单
               let param = {
                  orderNumber: this.productData.orderNumber,
                  rfids: epcs,
                  storeId: this.storeId,
               };
               this.lastCacheOrderDate = new Date();
               this.cacheOrder(param);
          }
          this.epcsFailCount = 0; //设置EPCS失败次数
      } else {
          this.epcsFailCount ++;
          console.log("当前为空次数为=====>"+this.epcsFailCount);
          //如果三次都为空列表，即显示欢迎界面
          if(this.epcsFailCount > 3){
             this.productData = {
               list: [],
               orderNumber : "",
             };
             this.step = 3;//没有扫描到商品，则转到欢迎页
             if (this.InventoryMultipleRunning) {
                console.log("要求循环读取信息.......05");
                setTimeout(this.InventoryMultipleData, 3000);
             }
             this.epcsFailCount = 0; //设置EPCS失败次数
          }else{
            if (this.InventoryMultipleRunning) {
              console.log("要求循环读取信息.......06");
              setTimeout(this.InventoryMultipleData, 3000);
            }
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
  /*overflow-y: auto;*/
}
.el-table__body-wrapper{
  overflow: hidden;
}
</style>
