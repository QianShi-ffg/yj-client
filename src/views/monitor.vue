<template>
  <div id="monitor">
    <el-container>
      <el-aside width="335px">
        <div class="left" style="-webkit-app-region: no-drag">
          <div class="user">
            <img
              :src="require('../assets/111.png')"
              alt=""
              width="40px"
              height="40px"
            />
            <div class="userMenu">
              <img
                v-for="(item, i) in menu"
                :src="item.src"
                alt=""
                width="22px"
                height="22px"
                :key="i"
                @click="clickMenu(item)"
              />
            </div>
            <div class="footerMenu">
              <img
                v-for="(item, i) in footerMenu"
                :src="item.src"
                alt=""
                width="22px"
                height="22px"
                :key="i"
                @click="clickMenu(item)"
              />
            </div>
          </div>
          <div class="body">
            <header></header>
            <div
              :id="`list${i}`"
              class="list"
              v-for="(item, i) in chatList"
              @click="selectChat(item, i)"
              :key="item.id"
            >
              <div class="left">
                <img :src="require('../assets/111.png')" alt="" />
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
            <span @click="minimize"
              ><img :src="require('../assets/icon/zuixiaohua.svg')" alt=""
            /></span>
            <span @click="maximize"
              ><img :src="require('../assets/icon/zuidahua.svg')" alt=""
            /></span>
            <span @click="close" class="close"
              ><img
                :src="require('../assets/icon/guanbi.svg')"
                alt=""
                @click="close"
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
// import { mapActions } from "vuex";
import { getChatList } from "../api/api";
import xiaoxi from "../assets/icon/xiaoxi.svg";
import wode from "../assets/icon/wode.svg";
import shoucang from "../assets/icon/shoucang.svg";
import wenjian from "../assets/icon/wenjian.svg";
import pengyouquan from "../assets/icon/pengyouquan.svg";
import sandian from "../assets/icon/sandian.svg";
import sanheng from "../assets/icon/sanheng.svg";
export default {
  name: 'chatMonitor',
  data() {
    return {
      currentListItem: "",
      chatList: [],
      toName: "",
      menu: [
        {
          name: "xiaoxi",
          src: xiaoxi,
        },
        {
          name: "wode",
          src: wode,
        },
        {
          name: "shoucang",
          src: shoucang,
        },
        {
          name: "wenjian",
          src: wenjian,
        },
        {
          name: "pengyouquan",
          src: pengyouquan,
        },
        {
          name: "sandian",
          src: sandian,
        },
      ],
      footerMenu: [
        {
          name: "sanheng",
          src: sanheng,
        },
      ],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // ...mapActions("myClient", ["setCleanMessage"]),
    async init() {
      const res = await ChatServer.getChatList();
      if (res.code === 200) {
        this.chatList = res.data.filter((item) => {
          return item.id !== sessionStorage.getItem("uuid");
        });
      }
    },
    minimize() {
      // Electron.ipcRenderer.send("minimize");
    },
    maximize() {
      // Electron.ipcRenderer.send()
    },
    close() {
      // Electron.ipcRenderer.send("close");
    },
    selectChat(item, i) {
      let list = [...document.getElementsByClassName("list")];
      list.forEach((item) => {
        item.className = "list";
      });
      let crrList = document.getElementById(`list${i}`);
      crrList.classList.add("is_active");
      this.$router.push({ name: "chatFrame", params: { id: item.id } });
      this.toName = item.name;
      // this.setCleanMessage(true);
      // 再次请求当前数据
      //-----------待开发
      let aaa = setTimeout(() => {
        // this.setCleanMessage(false);
        clearTimeout(aaa);
      }, 1000);
      //
    },
    clickMenu(item, i) {
      // currentListItem
      console.log(item, i);
    },
  },
};
</script>

<style lang="scss" scoped>
#monitor {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    border-right: 1px solid #ececec;
    position: relative;
    padding-left: 60px;
    .user {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      // justify-content: space-between;
      align-items: center;
      padding: 40px 0 10px;
      box-sizing: border-box;
      width: 60px;
      height: 100%;
      background-color: #2e2e2e;
      .userMenu {
        margin-top: 32px;
        display: flex;
        flex-direction: column;
        img {
          cursor: pointer;
          margin-bottom: 23px;
        }
      }
      .footerMenu {
        position: absolute;
        bottom: 10px;
        img {
          cursor: pointer;
          margin-top: 15px;
        }
      }
    }
    .body {
      width: 100%;
      height: 100%;
      -webkit-app-region: drag;
      background-color: #f7f7f7;
      header {
        -webkit-app-region: drag;
        height: 70px;
        width: 100%;
        background-color: #f7f7f7;
        box-sizing: border-box;
        border-right: 1px solid #ececec;
        border: none;
      }
      .list {
        -webkit-app-region: no-drag;
        user-select: none;
        // border: 1px solid #ececec;
        border-left: none;
        border-right: none;
        height: 70px;
        display: flex;
        background: #e6e5e5;
        .left {
          border: none;
          padding: 0;
          width: 60px;
          height: 100%;
          line-height: 100px;
          img {
            display: inline-block;
            width: 40px;
            height: 40px;
          }
        }
        .right {
          user-select: none;
          line-height: 60px;
          padding-left: 10px;
          box-sizing: border-box;
          span {
            // font-weight: 550;
            color: #000;
          }
        }
        &:hover {
          background-color: #d9d8d8;
        }
      }
      .list.is_active {
        background-color: #c5c4c5;
      }
    }
  }
  .el-header {
    padding: 0;
    height: 80px;
    position: relative;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e7e7e7;
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
    background-color: #f5f5f5;
    background-image: url("../assets/xiaoxi.png");
    background-repeat: no-repeat;
    background-size: 14%;
    background-position: 50% 46%;
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
