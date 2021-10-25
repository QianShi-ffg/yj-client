<template>
  <div id="monitor">
    <div class="left">
      <div class="user"></div>
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
        <el-input type="textarea" v-model="textarea" placeholder=""></el-input>
        <el-button type="primary" size="mini" class="btn" @click="submit">发送</el-button>
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
  .left {
    background-color: aquamarine;
    height: 100%;
    width: 240px;
    .user {
      height: 50px;
      width: 240px;
      background-color: rgb(165, 158, 158);
    }
  }
  .kuang {
    // margin: 0 auto;
    width: calc(100% - 200px);
    height: 100%;
    background: #ccc;
    .top {
      height: 85%;
      background-color: antiquewhite;
      .header {
        height: 50px;
        width: 100%;
        background: #ccc;
      }
      .content {
        width: 100%;
        height: calc(100% - 50px);

        ul {
          width: 100%;
          height: 100%;
          overflow-y: auto;
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
      padding: 20px 10px;
      .btn {
      }
    }
  }
}
</style>
