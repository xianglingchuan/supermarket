<template>
  <div class="IndexView_top_div">
      <HGroup v-if="step === 1" height="100%">
        <VGroup width="80%">
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
          <HGroup height="100px">
            <VGroup width="50%" height="100%" justify="center" padding="0px 0px 0px 30px">
              <span>请您仔细核对商品清单</span>
            </VGroup>
            <VGroup width="50%" height="100%" justify="center" padding="0px 0px 0px 30px" style="background-color: blue;color: white;font-weight: bold;">
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
            <div id="qrcode"></div>
            <span>使用微信、支付宝扫码支付</span>
            <VSpacer height="150px"></VSpacer>
        </VGroup>
      </HGroup>
      <div v-else-if="step === 2">
        11111
      </div>
      <HGroup v-else height="100%">
        <div style="width: 80%; height: 100%;">
          <el-carousel indicator-position="none" arrow="never" :interval="5000" trigger="click" width="100%" style="height: 100%;">
            <el-carousel-item v-for="item in 4" :key="item">
              <img width="100%" height="100%" src="xxx">
            </el-carousel-item>
          </el-carousel>
        </div>
        <VGroup width="20%" justify="center" align="center">
          <img width="200px" height="200px" src="xxx">
        </VGroup>
      </HGroup>
  </div>
</template>

<script>

export default {
  name: 'IndexView',
  data () {
    return {
      step: undefined,
      qrcode: undefined,
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
    var result = ipc.sendSync('synchronous-message', 'SoonkeReader_Connect');
    if (result.ret >= 0) {
      result = ipc.sendSync('synchronous-message', 'SoonkeReader_StartInventoryMultiple');
      if (result.ret >= 0) {
        this.InventoryMultipleRunning = true;
        this.InventoryMultipleData();
      }
    }
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
      self.$ajax.load({url:`/api/shop/cacheOrder`}, param, function (result) {
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
            if (self.step !== 1) {
              self.step = 1;
              if (newOrderId && newOrderId !== oldOrderId) {
                setTimeout(() => {
                  var el = document.getElementById("qrcode");
                  if (el) {
                    self.qrcode = new QRCode(document.getElementById("qrcode"), {
                      text: window.location.protocol+'//'+window.location.host+"/#/settle/index/PreparePayView?orderId=" + newOrderId,
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
        } else {
          self.productOrder = {
            sortResult: undefined,
            orderDetailDtoList: [],
          };
          self.step = 3;//没有返回订单，则转到欢迎页
        }
        if (self.InventoryMultipleRunning) {
          setTimeout(self.InventoryMultipleData, 50);
        }
      }, function (result) {
        if (self.InventoryMultipleRunning) {
          setTimeout(self.InventoryMultipleData, 50);
        }
      });
    },
    InventoryMultipleData() {
      var result = ipc.sendSync('synchronous-message', 'SoonkeReader_InventoryMultipleData');
      // if (result.ret >= 0) {
        let epcs = [];
        let epcMap = {};
        if (result.epcs && result.epcs.length > 0) {
          for (var i = result.epcs.length - 1; i >= 0; i--) {
            let epcId = result.epcs[i];
            if ('000000000000000000000000' === epcId) {
              continue;
            }
            if (!epcMap[epcId]) {
              epcMap[epcId] = epcId;
              epcs.push(epcId);
            }
          }
        }
        if (epcs.length > 0) {
          if (this.productOrder.orderDetailDtoList.length == 0) {
            //缓存订单
            let param = {
              id: '',
              productEpcIdList: epcs,
            };
            this.cacheOrder(param);
          } else {
            epcs.sort();
            let sortResult = epcs.join(',');
            if (!this.productOrder.sortResult || sortResult !== this.productOrder.sortResult) {
              console.log(`排序结果不等，重新缓存订单: old=${this.productOrder.sortResult}, new=${sortResult}`);
              //重新缓存订单
              let param = {
                id: this.productOrder.id,
                productEpcIdList: epcs,
              };
              this.cacheOrder(param);
            } else {
              if (this.InventoryMultipleRunning) {
                setTimeout(this.InventoryMultipleData, 50);
              }
            }
          }
        } else {
          this.productOrder = {
            orderDetailDtoList: [],
          };
          this.step = 3;//没有扫描到商品，则转到欢迎页
          if (this.InventoryMultipleRunning) {
            setTimeout(this.InventoryMultipleData, 50);
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
  }
}
</script>
<style type="text/css">
  .el-carousel__container {
    height: 100%;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.IndexView_top_div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  max-height: 100%;
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
