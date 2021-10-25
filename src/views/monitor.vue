<template>
  <div id="monitor">
    <div class="left">
      <div class="header"></div>
      <div class="body">
        <div class="list">
          <div class="left">
            <img src="" alt="">
          </div>
          <div class="right">
            <span>myclient</span>
          </div>
        </div>
      </div>
    </div>
    <div class="kuang">
      <div class="top">
        <div class="header"></div>
        <div class="content">
          <ul>
            <li v-for="item in messageList" :key="item">
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="bottom">
        <el-input type="textarea" v-model="textarea" placeholder="" :autosize="{ minRows: 1, maxRows: 2}" :spellcheck="false"></el-input>
        <el-button type="success" size="mini" class="btn" @click="submit">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      textarea: '',
      messageList: [],
      socket: null
    }
  },
  mounted() {
    this.socket = new WebSocket('ws://192.73.0.211:3010')

    this.init()
  },
  methods: {
    init() {
      this.socket.addEventListener('open', (event) => {
        console.log('socket is open', event)
      })

      this.socket.addEventListener('message', (event) => {
        this.refresh(JSON.parse(event.data).text)
      })
    },
    submit() {
      this.socket.send(JSON.stringify({ text: this.textarea }))
    },
    refresh(value) {
      // if (this.textarea !== '') {
      //   return
      // }
      this.messageList.push(value)
      this.textarea = ''
    }
  }
}
</script>

<style lang="scss" scoped>
#monitor {
  width: 100%;
  height: 500px;
  display: flex;
  border-top: 1px solid rgb(185, 185, 185);
  .left {
    // background-color: rgb(240, 240, 240);
    height: 100%;
    width: 240px;
    box-sizing: border-box;
    border-right: 1px solid rgb(185, 185, 185);
    .header {
      height: 50px;
      width: 240px;
      // background-color: #ccc;
      box-sizing: border-box;
      border-right: 1px solid rgb(185, 185, 185);
    }
    .body {
      width: 100%;
      height: calc(100% - 50px);
      .list {
        border: 1px solid rgb(185, 185, 185);
        border-left: none;
        border-right: none;
        height: 60px;
        display: flex;
        background:rgb(240, 240, 240);
        .left {
          width: 60px;
          height: 100%;
        }
        .right {
          line-height: 60px;
          padding-left: 10px;
          box-sizing: border-box;
        }
      }
    }
  }
  .kuang {
    // margin: 0 auto;
    width: calc(100% - 200px);
    height: 100%;
    // background: #ccc;
    .top {
      height: 85%;
      // background-color: rgb(248, 247, 245);
      .header {
        height: 50px;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid rgb(185, 185, 185);
        // background: #fff;
      }
      .content {
        width: 100%;
        height: calc(100% - 50px);

        ul {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          padding: 0;
          li {
            // display: block;
            list-style: none;
            margin: 10px 0;
            padding-left: 20px;
            text-align: left;
            span {
              display: inline-block;
              height: 100%;
              padding: 10px 5px;
              text-align: left;
              background: green;
              border-radius: 5px;
            }
          }
        }
      }
    }
    .bottom {
      display: flex;
      box-sizing: border-box;
      border-top: 1px solid rgb(185, 185, 185);
      padding: 10px 10px 0;
      ::v-deep.el-textarea {
        .el-textarea__inner {
          resize:none;
          &::-webkit-scrollbar{
            display: none;
          }
        }
      }
      .btn {
        margin: 0 10px 0 10px;
      }
    }
  }
}
</style>
