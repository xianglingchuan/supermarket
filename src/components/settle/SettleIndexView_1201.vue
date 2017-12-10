<template>
  <div class="SettleIndexView_top_div">
      <HGroup v-if="step === 1" height="100%" padding="0px">
        <VGroup width="80%" padding="0px">
          <HGroup justify="center" align="center" style="height: 100px;">
            <span style="color: blue;font-size: 24px;">商品清单</span>
          </HGroup>
          <HGroup justify="center">
            <el-table ref="mainTable" :data="productOrder.orderDetailDtoList" border stripe fit :max-height="viewCtrl.mainTabelMaxHeight"
              >
              <el-table-column prop="id" label="No." width="61" align="center">
                <template scope="scope">
                  <span>{{scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="productCategoryName" label="商品名称" min-width="200"></el-table-column>
              <el-table-column prop="price" label="商品单价（元）" align="right" width="200"></el-table-column>
              <el-table-column prop="productNum" label="商品数量（件）" align="right" width="200"></el-table-column>
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
                <span>{{productOrder.totalMoney}}</span>
              </HGroup>
              <VSpacer height="5px"></VSpacer>
              <HGroup align="baseline">
                <span>已优惠：￥</span>
                <span>0.00</span>
                <HSpacer width="100px"></HSpacer>
                <span>商品件数：</span>
                <span>{{productOrder.totalProductNum}}</span>
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
        <img width="100%" height="100%" :src="'./static/img/pay_finish.jpg'">
      </HGroup>
      <HGroup v-else height="100%" padding="0px">
        <div style="width: 80%; height: 100%;">
          <el-carousel indicator-position="none" arrow="never" :interval="5000" trigger="click" width="100%" style="height: 100%;">
            <el-carousel-item v-for="item in carouselItems" :key="item">
              <img width="100%" height="100%" :src="'./static/img/'+item">
            </el-carousel-item>
          </el-carousel>
        </div>
        <VGroup width="20%" justify="center" align="center">
          <img width="100%" height="100%" :src="'./static/img/operate_flow.jpg'">
        </VGroup>
      </HGroup>
  </div>
</template>




<script>

export default {
  name: 'SettleIndexView',
  data () {
    return {
      carouselItems: [
        'carousel7.jpg',
        'carousel8.jpg',
      ],
      readInterval: 100,
      step: undefined,
      //step: 1,
      lastCacheOrderDate: undefined,
      qrcode: undefined,
      epcMap: {},
      productOrder:{
        orderDetailDtoList: [],
      },
      viewCtrl: {
        mainTabelMaxHeight: 200,
      },
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
    /*var result = ipc.sendSync('synchronous-message', 'SoonkeReader_Connect');
    if (result.ret >= 0) {
      result = ipc.sendSync('synchronous-message', 'SoonkeReader_StartInventoryMultiple');
      if (result.ret >= 0) {
        this.InventoryMultipleRunning = true;
        this.InventoryMultipleData();
      }
    }*/


    this.InventoryMultipleData();


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
    cacheOrder(param) {
      let self = this;
//      self.$ajax.load({url:`http://localhost:8888/supermarket/api/product/createOrder`}, param, function (result) {
//
//
//        console.log("createOrder.result---->"+JSON.stringify(result))
//
//        var oldOrderId = self.productOrder.id;
//        var newOrderId = undefined;
//        if (result.data) {
//          newOrderId = result.data.id;
//        }
//        self.productOrder = result.data;
//        if (self.productOrder) {
//          if (self.productOrder.orderDetailDtoList.length == 0) {
//            self.productOrder = {
//              sortResult: undefined,
//              orderDetailDtoList: [],
//            };
//            self.step = 3;//没有返回订单，则转到欢迎页
//          } else {
//            let arr = [];
//            for (var i = self.productOrder.orderDetailDtoList.length - 1; i >= 0; i--) {
//              let orderDetailDto = self.productOrder.orderDetailDtoList[i];
//              for (var j = orderDetailDto.productEpcIdList.length - 1; j >= 0; j--) {
//                arr.push(orderDetailDto.productEpcIdList[j]);
//              }
//            }
//            arr.sort();
//            self.productOrder.sortResult = arr.join(',');
//            if (self.productOrder.orderStatus.value === 3) {//已结算
//              self.step = 2;
//              setTimeout(() => {
//                if (self.step === 2) {
//                  self.step = 3;
//                  self.productOrder = {
//                    sortResult: undefined,
//                    orderDetailDtoList: [],
//                  };
//                }
//              }, 2000);
//            } else {
//              if (self.step !== 1) {
//                self.step = 1;
//                if (newOrderId && newOrderId !== oldOrderId) {
//                  setTimeout(() => {
//                    var el = document.getElementById("qrcode");
//                    if (el) {
//                      el.innerHTML = '';
//                      let appid = self.productOrder.wxAppId;
//                      let redirect_uri = encodeURIComponent(window.location.protocol+'//'+window.location.host+"/frontend/?#/settle/index/PreparePayView");
//                      self.qrcode = new QRCode(el, {
//                        // text: window.location.protocol+'//'+window.location.host+"/frontend/#/settle/index/PreparePayView?orderId=" + newOrderId,
//                        text: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=${newOrderId}#wechat_redirect`,
//                        width: 200,
//                        height: 200,
//                        colorDark : "#000000",
//                        colorLight : "#ffffff",
//                        correctLevel : QRCode.CorrectLevel.H
//                      });
//                    }
//                  });
//                }
//              }
//            }
//          }
//        } else {
//          self.productOrder = {
//            sortResult: undefined,
//            orderDetailDtoList: [],
//          };
//          self.step = 3;//没有返回订单，则转到欢迎页
//        }
//        if (self.InventoryMultipleRunning) {
//          setTimeout(self.InventoryMultipleData, self.readInterval);
//        }
//      }, function (result) {
//        if (self.InventoryMultipleRunning) {
//          setTimeout(self.InventoryMultipleData, self.readInterval);
//        }
//      });


      $.ajax({
        type: "POST",
        url: "http://localhost:8888/supermarket/api/product/createOrder",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(param),
        dataType: "json",
        success: function (result) {

        console.log("createOrder.result---->"+JSON.stringify(result))

        var oldOrderId = self.productOrder.id;
        var newOrderId = undefined;
        if (result.data) {
          newOrderId = result.data.id;
        }
        self.productOrder = result.data;
        if (self.productOrder) {
          if (self.productOrder.orderDetailDtoList.length == 0) {
            self.productOrder = {
              sortResult: undefined,
              orderDetailDtoList: [],
            };
            self.step = 3;//没有返回订单，则转到欢迎页
          } else {
            let arr = [];
            for (var i = self.productOrder.orderDetailDtoList.length - 1; i >= 0; i--) {
              let orderDetailDto = self.productOrder.orderDetailDtoList[i];
              for (var j = orderDetailDto.productEpcIdList.length - 1; j >= 0; j--) {
                arr.push(orderDetailDto.productEpcIdList[j]);
              }
            }
            arr.sort();
            self.productOrder.sortResult = arr.join(',');
            if (self.productOrder.orderStatus.value === 3) {//已结算
              self.step = 2;
              setTimeout(() => {
                if (self.step === 2) {
                  self.step = 3;
                  self.productOrder = {
                    sortResult: undefined,
                    orderDetailDtoList: [],
                  };
                }
              }, 2000);
            } else {
              if (self.step !== 1) {
                self.step = 1;
                if (newOrderId && newOrderId !== oldOrderId) {
                  setTimeout(() => {
                    var el = document.getElementById("qrcode");
                    if (el) {
                      el.innerHTML = '';
                      let appid = self.productOrder.wxAppId;
                      let redirect_uri = encodeURIComponent(window.location.protocol+'//'+window.location.host+"/frontend/?#/settle/index/PreparePayView");
                      self.qrcode = new QRCode(el, {
                        // text: window.location.protocol+'//'+window.location.host+"/frontend/#/settle/index/PreparePayView?orderId=" + newOrderId,
                        text: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=${newOrderId}#wechat_redirect`,
                        width: 200,
                        height: 200,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.H
                      });
                    }
                  });
                }
              }
            }
          }
        } else {
          self.productOrder = {
            sortResult: undefined,
            orderDetailDtoList: [],
          };
          self.step = 3;//没有返回订单，则转到欢迎页
        }
        if (self.InventoryMultipleRunning) {
          setTimeout(self.InventoryMultipleData, self.readInterval);
        }




//          if (message > 0) {
//            alert("请求已提交！我们会尽快与您取得联系");
//          }
        },
        error: function (message) {

        if (self.InventoryMultipleRunning) {
          setTimeout(self.InventoryMultipleData, self.readInterval);
        }

          //$("#request-process-patent").html("提交数据失败！");
        }
      });



//      self.$ajax.load({url:`http://localhost:8888/supermarket/api/product/createOrder`}, param, function (result) {
//
//
//        console.log("createOrder.result---->"+JSON.stringify(result))
//
//        var oldOrderId = self.productOrder.id;
//        var newOrderId = undefined;
//        if (result.data) {
//          newOrderId = result.data.id;
//        }
//        self.productOrder = result.data;
//        if (self.productOrder) {
//          if (self.productOrder.orderDetailDtoList.length == 0) {
//            self.productOrder = {
//              sortResult: undefined,
//              orderDetailDtoList: [],
//            };
//            self.step = 3;//没有返回订单，则转到欢迎页
//          } else {
//            let arr = [];
//            for (var i = self.productOrder.orderDetailDtoList.length - 1; i >= 0; i--) {
//              let orderDetailDto = self.productOrder.orderDetailDtoList[i];
//              for (var j = orderDetailDto.productEpcIdList.length - 1; j >= 0; j--) {
//                arr.push(orderDetailDto.productEpcIdList[j]);
//              }
//            }
//            arr.sort();
//            self.productOrder.sortResult = arr.join(',');
//            if (self.productOrder.orderStatus.value === 3) {//已结算
//              self.step = 2;
//              setTimeout(() => {
//                if (self.step === 2) {
//                  self.step = 3;
//                  self.productOrder = {
//                    sortResult: undefined,
//                    orderDetailDtoList: [],
//                  };
//                }
//              }, 2000);
//            } else {
//              if (self.step !== 1) {
//                self.step = 1;
//                if (newOrderId && newOrderId !== oldOrderId) {
//                  setTimeout(() => {
//                    var el = document.getElementById("qrcode");
//                    if (el) {
//                      el.innerHTML = '';
//                      let appid = self.productOrder.wxAppId;
//                      let redirect_uri = encodeURIComponent(window.location.protocol+'//'+window.location.host+"/frontend/?#/settle/index/PreparePayView");
//                      self.qrcode = new QRCode(el, {
//                        // text: window.location.protocol+'//'+window.location.host+"/frontend/#/settle/index/PreparePayView?orderId=" + newOrderId,
//                        text: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=${newOrderId}#wechat_redirect`,
//                        width: 200,
//                        height: 200,
//                        colorDark : "#000000",
//                        colorLight : "#ffffff",
//                        correctLevel : QRCode.CorrectLevel.H
//                      });
//                    }
//                  });
//                }
//              }
//            }
//          }
//        } else {
//          self.productOrder = {
//            sortResult: undefined,
//            orderDetailDtoList: [],
//          };
//          self.step = 3;//没有返回订单，则转到欢迎页
//        }
//        if (self.InventoryMultipleRunning) {
//          setTimeout(self.InventoryMultipleData, self.readInterval);
//        }
//      }, function (result) {
//        if (self.InventoryMultipleRunning) {
//          setTimeout(self.InventoryMultipleData, self.readInterval);
//        }
//      });






    },

    InventoryMultipleData() {

      //this.testPost();

      //var result = ipc.sendSync('synchronous-message', 'SoonkeReader_InventoryMultipleData');
      var result = {ret:1,epcs:["10000000002","10000000001","10000000003","10000000004","1111"]};
      console.log("result------>:"+JSON.stringify(result));
      // if (result.ret >= 0) {
        if (result.epcs && result.epcs.length > 0) {
          for (var i = result.epcs.length - 1; i >= 0; i--) {
            let epcId = result.epcs[i];
            if ('000000000000000000000000' === epcId) {
              continue;
            }
            this.epcMap[epcId] = new Date().getTime();
          }
        }
      /*if (!this.lastCacheOrderDate) {
          this.lastCacheOrderDate = new Date();
          if (this.InventoryMultipleRunning) {
            setTimeout(this.InventoryMultipleData, this.readInterval);
          }
          return;
        } else {
          if (new Date().getTime() - this.lastCacheOrderDate < 2000) {
            if (this.InventoryMultipleRunning) {
              setTimeout(this.InventoryMultipleData, this.readInterval);
            }
            return;
          } else {
            // 将在2秒钟内收集到的EPC发送到后台检测
          }
        }*/

        let epcs = [];
        for (var epc in this.epcMap) {
          if (new Date().getTime() - this.epcMap[epc] < 2000) {
            epcs.push(epc);
          } else {
            delete this.epcMap[epc];
          }
        }
        console.log("epcs.length------->:"+epcs.length)
        if (epcs.length > 0) {
          if (this.productOrder.orderDetailDtoList.length == 0) {
            //缓存订单
            let param = {
              id: '',
              //productEpcIdList: epcs,
              rfids: epcs,
              storeId: '4',
            };
            this.lastCacheOrderDate = new Date();
            this.cacheOrder(param);


          } else {
            //epcs.sort();
            //let sortResult = epcs.join(',');
            //if (!this.productOrder.sortResult || sortResult !== this.productOrder.sortResult) {
            //  console.log(`排序结果不等，重新缓存订单: old=${this.productOrder.sortResult}, new=${sortResult}`);
              //重新缓存订单
              let param = {
                id: this.productOrder.id,
                productEpcIdList: epcs,
              };
              this.lastCacheOrderDate = new Date();
              this.cacheOrder(param);
            //} else {
            //  if (this.InventoryMultipleRunning) {
            //    setTimeout(this.InventoryMultipleData, this.readInterval);
            //  }
            //}
          }
        } else {
          this.productOrder = {
            orderDetailDtoList: [],
          };
          this.step = 3;//没有扫描到商品，则转到欢迎页
          if (this.InventoryMultipleRunning) {
            setTimeout(this.InventoryMultipleData, 3000);
          }
        }
      // } else {
      //   if (this.InventoryMultipleRunning) {
      //     setTimeout(this.InventoryMultipleData, 50);
      //   }
      // }
    },
    StopInventoryMultiple() {
      this.InventoryMultipleRunning = false;
      var result = ipc.sendSync('synchronous-message', 'SoonkeReader_StopInventoryMultiple');
      while (result.ret < 0) {
        result = ipc.sendSync('synchronous-message', 'SoonkeReader_StopInventoryMultiple');
      }
      ipc.sendSync('synchronous-message', 'SoonkeReader_Disconnect');
    },

    testPost(){
      console.log("start testPost......");
      $.ajax({
         type: "POST",
         url: "http://localhost:8888/supermarket/api/product/createOrder",
         contentType: "application/json; charset=utf-8",
         data: JSON.stringify({"params":"111"}),
         dataType: "json",
         success: function (message) {
           if (message > 0) {
             alert("请求已提交！我们会尽快与您取得联系");
           }
         },
         error: function (message) {
           $("#request-process-patent").html("提交数据失败！");
         }
       });

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
