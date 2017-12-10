<template>
  <el-card class="box-card LoginPannel_top">
    <div slot="header" class="clearfix">
      <span>登 录</span>
    </div>
    <el-form :model="loginParam" :rules="rules" ref="loginForm" label-width="0px">
      <el-form-item prop="userNo">
        <el-input v-model="loginParam.userNo">
          <template slot="prepend">
            <i class="el-icon-anticon-user"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input v-model="loginParam.pwd" type="password">
          <template slot="prepend">
            <i class="el-icon-anticon-lock"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="delivery">
        <el-checkbox v-model="loginParam.rememberPwd">记住密码</el-checkbox>
      </el-form-item>
    </el-form>
    <el-row class="btn_login_row" type="flex" justify="end" align="middle">
      <el-button type="primary" class="btn_login" :loading="viewCtrl.loginLoading" @click="login">登 录</el-button>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'LoginPannel',
  data() {
    let data = {
      loginParam: {
        userNo: '',
        pwd: '',
        encrypted: false,
        rememberPwd: false
      },
      rules: {
        userNo: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      localStorage_rememberLoginInfo_key: 'rememberLoginInfo',
      viewCtrl: {
        loginLoading: false
      }
    };
    let rememberLoginInfo = JSON.parse(localStorage.getItem(data.localStorage_rememberLoginInfo_key));
    if (rememberLoginInfo) {
      data.loginParam.userNo = rememberLoginInfo.userNo;
      data.loginParam.pwd = rememberLoginInfo.pwd;
      data.loginParam.encrypted = true;
      data.loginParam.rememberPwd = true;
    } else {
      data.loginParam.encrypted = false;
      data.loginParam.rememberPwd = false;
    }
    return data;
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
  watch: {
    'loginParam.userNo': function (newVal, oldVal) {
      if (this.loginParam.encrypted) {
        if (newVal !== '') {
          this.loginParam.userNo = '';
        }
        if (this.loginParam.pwd !== '') {
          this.loginParam.pwd = '';
        }
        this.loginParam.encrypted = false;
      }
    },
    'loginParam.pwd': function (newVal, oldVal) {
      if (this.loginParam.encrypted) {
        if (newVal !== '') {
          this.loginParam.pwd = '';
        }
        if (this.loginParam.userNo !== '') {
          this.loginParam.userNo = '';
        }
        this.loginParam.encrypted = false;
      }
    }
  },
  //相关操作事件
  methods: {
    login: function (event) {
      let self = this;
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          self.viewCtrl.loginLoading = true;
          self.$ajax.load({url: `/api/doLogin`}, self.loginParam, function (result) {
            self.viewCtrl.loginLoading = false;
            if (self.loginParam.rememberPwd) {
              let rememberLoginInfo = {};
              rememberLoginInfo.userNo = result.data.userNo;
              rememberLoginInfo.pwd = result.data.pwd;
              localStorage.setItem(self.localStorage_rememberLoginInfo_key, JSON.stringify(rememberLoginInfo));
            }
            self.$router.push({
              path: '/index'
            });
          }, function (result) {
            self.viewCtrl.loginLoading = false;
          });
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.LoginPannel_top {
  width: 300px;
  /*border: 1px solid #ccc;*/
  /*padding: 0px 5px 0px 5px;*/
  /*background: white;
  box-shadow: 2px 3px 8px black*/
}
.LoginPannel_top .btn_login_row {

}
.LoginPannel_top .btn_login {
  float: right;
  /*margin-left: auto;*/
}
</style>
