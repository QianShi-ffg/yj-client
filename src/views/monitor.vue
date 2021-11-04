<template>
  <div id="monitor">
    <div class="left">
      <div class="header"></div>
      <div class="body">
        <div class="list" v-for="(item, i) in chatList" @click="selectChat(item.id)" :key="item.id" :tabindex="i">
          <div class="left">
            <img src="" alt="" />
          </div>
          <div class="right">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import ChatServer from '../api/api'
export default {
  data() {
    return {
      chatList: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const res = await ChatServer.getChatList()
      if (res.code === 200) {
        this.chatList = res.data
      }
    },
    selectChat(id) {
      this.$router.push({ name: 'chatFrame', params: { id: id } })
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
    width: 240px;
    box-sizing: border-box;
    border-right: 1px solid #ececec;
    .header {
      height: 50px;
      width: 240px;
      // background-color: #ccc;
      box-sizing: border-box;
      border-right: 1px solid #ececec;
    }
    .body {
      width: 100%;
      height: calc(100% - 50px);
      .list {
        border: 1px solid #ececec;
        border-left: none;
        border-right: none;
        height: 60px;
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
