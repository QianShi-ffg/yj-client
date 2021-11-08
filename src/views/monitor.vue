<template>
  <div id="monitor">
    <el-container>
      <el-aside width="335px">
        <div class="left" style="-webkit-app-region: no-drag">
          <div class="user"></div>
          <div class="body">
            <header></header>
            <div class="list" v-for="(item, i) in chatList" @click="selectChat(item)" :key="item.id" :tabindex="i">
              <div class="left">
                <img src="" alt="" />
              </div>
              <div class="right">
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-aside>
      <el-container>
        <el-header height="70px"
          ><nav class="toolbar">
            <span @click="minimize"><img :src="require('../assets/icon/zuixiaohua.svg')" alt="" /></span>
            <span @click="maximize"><img :src="require('../assets/icon/zuidahua.svg')" alt="" /></span>
            <span @click="close" class="close"
              ><img :src="require('../assets/icon/guanbi.svg')" alt="" @click="close"
            /></span>
          </nav>
          <div class="title">{{ toName }}</div>
        </el-header>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
    <!-- <el-container>
      <el-header height="80px">
        
        <div class="title">{{ toName }}</div>
      </el-header>
      <el-container>
        <el-aside width="280px"> </el-aside>
        <el-main>
          
        </el-main>
      </el-container>
    </el-container> -->
  </div>
</template>

<script>
import Electron from '../util/preload'
import ChatServer from '../api/api'
export default {
  data() {
    return {
      chatList: [],
      toName: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const res = await ChatServer.getChatList()
      if (res.code === 200) {
        this.chatList = res.data.filter((item) => {
          return item.id !== sessionStorage.getItem('uuid')
        })
      }
    },
    minimize() {
      Electron.ipcRenderer.send('minimize')
    },
    maximize() {
      // Electron.ipcRenderer.send()
    },
    close() {
      Electron.ipcRenderer.send('close')
    },
    selectChat(item) {
      this.$router.push({ name: 'chatFrame', params: { id: item.id } })
      this.toName = item.name
    }
  }
}
</script>

<style lang="scss" scoped>
#monitor {
  width: 100%;
  height: 100%;
  display: flex;
  // border-top: 1px solid #ececec;
  .left {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    border-right: 1px solid #ececec;
    position: relative;
    padding-left: 60px;
    .user {
      width: 60px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #2e2e2e;
    }
    .body {
      width: 100%;
      height: 100%;
      header {
        height: 70px;
        width: 100%;
        // background-color: #ccc;
        box-sizing: border-box;
        border-right: 1px solid #ececec;
        border: none;
      }
      .list {
        // border: 1px solid #ececec;
        border-left: none;
        border-right: none;
        height: 70px;
        display: flex;
        background: #e6e5e5;
        .left {
          width: 60px;
          height: 100%;
        }
        .right {
          line-height: 60px;
          padding-left: 10px;
          box-sizing: border-box;
        }
        &:hover {
          background-color: #d9d8d8;
        }
        &:focus {
          background-color: #c5c4c5;
        }
      }
    }
  }
  .el-header {
    padding: 0;
    height: 80px;
    position: relative;
    // -webkit-app-region: drag;
    .title {
      position: absolute;
      width: 135px;
      height: 20px;
      font-size: 20px;
      left: 30px;
      bottom: 15px;
      width: 300px;
      text-align: left;
      color: #000;
    }
    .toolbar {
      position: absolute;
      right: 0;
      text-align: right;
      height: 28px;
      user-select: none;
      span {
        -webkit-app-region: no-drag;
        display: inline-block;
        height: 100%;
        width: 40px;
        text-align: center;
        line-height: 30px;
        &:hover {
          background: #e3e3e3;
          cursor: pointer;
        }
        &.close:hover {
          background: #fa5151;
        }
        img {
          height: 45%;
          user-select: none;
        }
      }
    }
  }
  .el-main {
    padding: 0;
    -webkit-app-region: no-drag;
  }
}
.spansty {
  display: inline-block;
  // width: 65%;
  max-width: 65%;
  height: 100%;
  padding: 10px 12px;
  text-align: left;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 1px 1px rgb(238, 238, 238);
  word-wrap: break-word;
  word-break: normal;
  overflow: hidden;
}
</style>
