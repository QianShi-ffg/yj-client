<template>
  <div class="kuang">
    <div class="top">
      <div class="header"></div>
      <div class="content">
        <ul ref="ul">
          <li
            v-for="(item, i) in messageList"
            :class="item.uuid === uuid ? 'right' : 'left'"
            :key="`item${i}`"
            :id="`liText${i}`"
            v-html="item.text"
          >
            <!-- {{ show(item, i) }} -->
          </li>
        </ul>
      </div>
    </div>
    <div class="actionBar">
      <img class="emoji" :src="require('assets/icon/emoticon.svg')" alt="" />
      <img class="file" :src="require('assets/icon/file.svg')" alt="" />
      <img class="shot" :src="require('assets/icon/screenShot.svg')" alt="" />
      <img class="video" :src="require('assets/icon/videoCall.svg')" alt="" />
    </div>
    <chatInputVue :uuid="uuid" :clean="clean" @submit="submit" @textClean="textClean"></chatInputVue>
  </div>
</template>

<script>
import chatInputVue from '../components/chatInput.vue'
export default {
  components: {
    chatInputVue
  },
  data() {
    return {
      otherId: '',
      textarea: '',
      messageList: [],
      socket: null,
      scrollTop: null,
      uuid: null,
      liWidth: null,
      clean: false
    }
  },
  watch: {
    liWidth(newVal) {
      console.log(newVal)
    }
  },
  mounted() {
    this.socket = new WebSocket('ws://192.73.0.211:3010')
    // this.socket = new WebSocket('ws://188.131.164.41:3010')
    this.init()
    console.log(555)
    this.uuid = `15666${parseInt(Math.random() * 10000000)}`
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to)
    this.otherId = to.params.id //路由携带的不同参数
    this.init() //在mounted调用的methods里的方法
    this.socket.onclose = () => {
      console.log('连接关闭')
    }
    next()
  },
  beforeRouteLeave(to, from, next) {
    console.log(to)
    this.socket.onclose = () => {
      console.log('连接关闭')
    }
    // this.socket.addEventListener('close', (event) => {
    //   console.log('socket is close', event)
    //   this.socket.send('aa')
    // })
    next()
  },
  methods: {
    init() {
      this.socket.addEventListener('open', (event) => {
        console.log('socket is open', event)
        this.socket.send(
          JSON.stringify({
            type: 'login', // type：login表示登录 用于后端逻辑判断
            id: this.uuid,
            name: '',
            icon: ''
          })
        )
      })

      this.socket.addEventListener('message', async (event) => {
        await this.refresh(JSON.parse(event.data))
        this.$nextTick(() => {
          const ulS = document.getElementsByTagName('ul')[0].scrollHeight
          if (ulS > 307) {
            document.getElementsByClassName('content')[0].scrollTop = ulS
          }
        })
      })

      window.onresize = () => {
        return (() => {
          console.log(document.getElementsByTagName('ul'))
          const li = document.getElementsByTagName('ul')[0]
          this.liWidth = li.clientWidth - 40
        })()
      }
    },
    submit(value) {
      console.log(value)
      value.map((item) => {
        this.socket.send(JSON.stringify(item))
      })
    },
    async refresh(value) {
      await this.show(value)
      this.messageList.push(value)
      this.clean = true
    },
    show(value) {
      console.log(value)
      let spanSty = [
        'display: inline-block;',
        'max-width: 65%;',
        // 'height: 100%;',
        'padding: 10px 12px;',
        'text-align: left;',
        'border-radius: 5px;',
        'box-shadow: 0 0 1px 1px rgb(238, 238, 238);',
        'word-wrap: break-word;',
        'word-break: normal;',
        'overflow: hidden;'
      ]
      if (value.uuid === this.uuid) {
        spanSty.push('background: #9eea6a;')
      } else {
        spanSty.push('background: #fff;')
      }
      if (value.nodeType === 3) {
        value.text = `<span style="${spanSty.join().replaceAll(',', '')}">${value.text}</span>`
      } else if (value.nodeType === 1) {
        value.text = `<img src=${value.url} width="${value.style.width > 180 ? 180 : value.style.width}px;"></img>`
      }
    },
    textClean(value) {
      this.clean = value
    }
  }
}
</script>

<style lang="scss" scoped>
.kuang {
  // margin: 0 auto;
  position: relative;
  width: calc(100% - 200px);
  height: 100%;
  overflow: hidden;
  // background: #ccc;
  .top {
    height: 70%;
    box-sizing: border-box;
    border-bottom: 1px solid #ececec;
    // background-color: rgb(248, 247, 245);
    .header {
      height: 50px;
      width: 100%;
      box-sizing: border-box;
      border-bottom: 1px solid #ececec;
      // background: #fff;
    }
    .content {
      width: 100%;
      height: calc(100% - 50px);
      overflow-y: auto;
      background: #f5f5f5;
      &::-webkit-scrollbar {
        display: none;
      }
      ul {
        // display: inline-block;
        width: 100%;
        // height: 100%;
        min-height: 307px;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        padding: 0 20px;
        // background: #f5f5f5;

        li {
          // display: block;
          width: 100%;
          list-style: none;
          margin: 10px 0;
          border: none;
          // padding-left: 20px;
          // text-align: left;
          span.spansty {
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
          &.left {
            text-align: left;
            span.spansty {
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
          }
          &.right {
            padding-right: 20px;
            text-align: right;
            span.spansty {
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
          }
        }
      }
    }
  }

  .actionBar {
    position: absolute;
    // background: red;
    width: 100%;
    height: 30px;
    // bottom: 128px;
    img {
      position: absolute;
      top: 5px;
      bottom: 0;
      margin: auto;
      width: 20px;
      height: 20px;
      cursor: pointer;
      &.video {
        right: 20px;
      }
      &.emoji {
        left: 25px;
      }
      &.file {
        left: 55px;
      }
      &.shot {
        left: 83px;
      }
    }
  }
}
</style>
