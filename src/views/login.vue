<template>
  <div class="login" style="-webkit-app-region: no-drag">
    <div class="title">
      <i class="el-icon-close" @click="exit"></i>
    </div>
    <div class="body">
      <div class="logo" style="text-align: center; margin-top: 15px">
        <transition name="fade">
          <img src="../assets/logo.png" width="60" height="60" v-show="showLogo" />
        </transition>
      </div>
      <!-- <transition name="fade"> -->
      <div v-show="showForm">
        <div style="margin-top: 30px">
          <el-input v-model="user.name" placeholder="请输入账号"></el-input>
          <el-input v-model="user.password" placeholder="请输入密码" type="password" style="margin-top: 5px"></el-input>
          <el-checkbox v-model="remember">下次直接登录</el-checkbox>
          <el-button type="primary" class="submit" size="mini" @click="login">登 录</el-button>
        </div>
        <div class="option">
          <el-button type="text" size="mini">注册账号</el-button>
          <el-button type="text" size="mini">忘记密码</el-button>
          <el-button type="text" size="mini">扫码登录</el-button>
        </div>
      </div>
      <!-- </transition> -->
    </div>
  </div>
</template>

<script>
// import { Remote, IpcRenderer } from '../util/preload'
import Electron from '../util/preload'
import ChatServer from '../api/api'
//打印remote模块
// console.log(IpcRenderer)
export default {
  name: 'login',
  data() {
    return {
      remember: false,
      showLogo: false,
      showForm: false,
      user: {
        name: '',
        password: ''
      }
    }
  },
  beforeCreate() {
    console.log(666)
    Electron.remote.getCurrentWebContents().closeDevTools()
    Electron.remote.getCurrentWindow().setSize(250, 350, false)
  },
  mounted() {
    Electron.remote.getCurrentWindow().setSize(250, 350, false)
    this.showLogo = true
    let that = this
    setTimeout(() => {
      that.showForm = true
    }, 100)
  },
  methods: {
    exit() {
      // Electron.remote.app.quit()
      Electron.ipcRenderer.send('close')
      Electron.remote.getCurrentWindow().hide()
    },
    async login() {
      console.log(this.$router)
      const res = await ChatServer.login(this.user)
      if (res.code === 200) {
        sessionStorage.setItem('uuid', res.data.id)
        Electron.ipcRenderer.send('changWindowSize', '登录成功')
        this.$router.push('/monitor')
      }
    }
  }
}
</script>

<style scoped lang="scss">
// @import '@/assets/style/theme';
.login {
  height: 100%;
  // width: 300px;
  // max-width: 300px;
  // min-width: 300px;
  overflow: hidden;
}
.ft {
  position: fixed;
  top: 250px;
  left: 45px;
  font-size: large;
  color: #7f7f7f;
  text-align: center;
}
::v-deep .body {
  display: inline-block;
  padding: 0 20px;
  min-width: 210px;
  height: 100%;
  // background-color: @grayBgc;
  .el-checkbox__label {
    font-size: 12px;
  }
  .el-checkbox {
    font-size: small;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    // color: @primary;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    // color: @primary;
    // background-color: @primary;
    // border-color: @primary;
  }
  .el-button.submit {
    background-color: #24db5a;
    border-color: unset;
    height: 35px;
    &:hover {
      // background-color: @primary;
      // border-color: @primary;
    }

    margin-top: 5px;
    width: 100%;
  }

  .option {
    text-align: center;

    .el-button--text {
      color: #07c160;
    }
  }

  .el-input {
    margin: 0 0 10px;

    .el-input__inner {
      outline: none;
      height: 30px;
      border: none;
      border-bottom: 1px solid#07c160;
      border-radius: 0;
    }
  }

  .el-button {
    height: 45px;
  }
}

.title {
  text-align: left;
  width: 100%;
  height: 50px;
  line-height: 50px;
  // background-color: @grayBgc;
  -webkit-app-region: drag;
  i {
    cursor: pointer;
    float: right;
    margin-right: 10px;
    margin-top: 10px;
    -webkit-app-region: no-drag;
  }

  i:hover {
    color: #07c160;
  }
}

.el-input.is-active .el-input__inner,
.el-input__inner:focus {
  // border-color: @primary !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
