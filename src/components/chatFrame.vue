<template>
  <div class="kuang">
    <div class="top">
      <div class="content">
        <ul ref="ul">
          <li
            v-for="(item, i) in messageList"
            :class="item.uuid === uuid ? 'right' : 'left'"
            :key="`item${i}`"
            :id="`liText${i}`"
          >
            <span class="chatSpan">
              <img
                class="failSend"
                :src="require('assets/icon/gantanhao.svg')"
                alt=""
                v-show="item.uuid === uuid && item.failSend"
              />
              <span v-html="item.text"></span>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="actionBar">
      <img class="emoji" :src="require('assets/icon/emoticon.svg')" alt="" @click="emojiclick" />
      <emoji :emojiVisible="emojiVisible" @emojiVisibleClose="emojiVisibleClose"></emoji>
      <label for="openFile">
        <img class="file" :src="require('assets/icon/file.svg')" alt="" />
      </label>
      <input id="openFile" type="file" style="display: none" />
      <img class="shot" :src="require('assets/icon/screenShot.svg')" alt="" />
      <img class="video" :src="require('assets/icon/videoCall.svg')" alt="" />
    </div>
    <chatInputVue :uuid="uuid" :clean="clean" @submit="submit" @textClean="textClean"></chatInputVue>
  </div>
</template>

<script>
import chatInputVue from '../components/chatInput.vue'
import emoji from '../components/emoji.vue'
import { mapActions } from 'vuex'
export default {
  components: {
    chatInputVue,
    emoji
  },
  data() {
    return {
      emojiVisible: false,
      otherId: '',
      textarea: '',
      messageList: [],
      socket: null,
      scrollTop: null,
      uuid: null,
      liWidth: null,
      clean: false
      // failSend: false
    }
  },
  watch: {
    liWidth(newVal) {
      console.log(newVal)
    }
  },
  mounted() {
    this.init()
    console.log(555)
    this.uuid = sessionStorage.getItem('uuid')
    // this.uuid = `15666${parseInt(Math.random() * 10000000)}`
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to)
    this.socket.close()
    // this.socket.send('连接关闭')
    console.log('连接关闭')
    this.otherId = to.params.id //路由携带的不同参数
    this.init() //在mounted调用的methods里的方法
    next()
  },
  methods: {
    ...mapActions('myClient', ['setRange']),
    init() {
      this.socket = new WebSocket('ws://192.73.0.211:3010')
      // this.socket = new WebSocket('ws://188.131.164.41:3010')
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
          const li = document.getElementsByTagName('ul')[0]
          this.liWidth = li.clientWidth - 40
        })()
      }
    },
    submit(value) {
      console.log(value)
      value.map(async (item) => {
        this.socket.send(JSON.stringify(item))
      })
    },
    async refresh(value) {
      console.log(value)
      await this.show(value)
      this.messageList.push(value)
      this.clean = true
    },
    show(value) {
      console.log(value)
      let spanSty = [
        'display: inline-block;',
        'max-width: 94%;',
        // 'height: 100%;',
        'padding: 10px 12px;',
        'text-align: left;',
        'border-radius: 5px;',
        'box-shadow: 0 0 1px 1px rgb(238, 238, 238);',
        'word-wrap: break-word;',
        'word-break: normal;',
        'overflow: hidden;'
      ]

      let failSend = [
        'z-index: 10;',
        'position: absolute;',
        'left: 0;',
        'top: 0;',
        'bottom: 0;',
        'margin: auto;',
        'display: inline-block;',
        'height: 22px;',
        'width: 22px;',
        'border-radius: 11px;'
      ]
      if (value.uuid === this.uuid) {
        spanSty.push('background: #9eea6a;')
      } else {
        spanSty.push('background: #fff;')
      }
      if (value.nodeType === 3) {
        // if (value.failSend) {
        //   value.text = `<img
        //         class="failSend"
        //         src="${require('assets/icon/gantanhao.svg')}"
        //         alt=""
        //         style="${failSend.join().replaceAll(',', '')}"
        //       /><span style="${spanSty.join().replaceAll(',', '')}">${value.text}</span>`
        // } else {
        value.text = `<span style="${spanSty.join().replaceAll(',', '')}">${value.text}</span>`
        // }
      } else if (value.nodeType === 1) {
        if (value.failSend) {
          value.text = `<img
                class="failSend"
                src="${require('assets/icon/gantanhao.svg')}"
                alt=""
                style="${failSend.join().replaceAll(',', '')}"
              /><img src=${value.url} width="${value.style.width > 180 ? 180 : value.style.width}px;"></img>`
        } else {
          value.text = `<img src=${value.url} width="${value.style.width > 180 ? 180 : value.style.width}px;"></img>`
        }
      }
    },
    textClean(value) {
      this.clean = value
    },
    async emojiclick() {
      let range = await this.saveSelection()
      this.setRange(range)
      this.emojiVisible = true
    },
    // 保存焦点位置
    saveSelection() {
      if (window.getSelection) {
        let sel = window.getSelection()
        if (sel.getRangeAt && sel.rangeCount) {
          return sel.getRangeAt(0)
        }
      } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange()
      }
      return null
    },
    emojiVisibleClose(value) {
      this.emojiVisible = value
    }
  }
}
</script>

<style lang="scss" scoped>
.kuang {
  // margin: 0 auto;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  // background: #ccc;
  .top {
    height: 70%;
    box-sizing: border-box;
    border-bottom: 1px solid #ececec;
    // background-color: rgb(248, 247, 245);
    .content {
      width: 100%;
      height: 100%;
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
          // span.spansty {
          //   display: inline-block;
          //   // width: 65%;
          //   max-width: 65%;
          //   height: 100%;
          //   padding: 10px 12px;
          //   text-align: left;
          //   background: #fff;
          //   border-radius: 5px;
          //   box-shadow: 0 0 1px 1px rgb(238, 238, 238);
          //   word-wrap: break-word;
          //   word-break: normal;
          //   overflow: hidden;
          // }
          &.left {
            text-align: left;
            // span.spansty {
            //   display: inline-block;
            //   // width: 65%;
            //   max-width: 65%;
            //   height: 100%;
            //   padding: 10px 12px;
            //   text-align: left;
            //   background: #fff;
            //   border-radius: 5px;
            //   box-shadow: 0 0 1px 1px rgb(238, 238, 238);
            //   word-wrap: break-word;
            //   word-break: normal;
            //   overflow: hidden;
            // }
          }
          &.right {
            padding-right: 20px;
            text-align: right;
            .chatSpan {
              display: inline-block;
              height: 100%;
              max-width: 65%;
              position: relative;
              padding-left: 25px;
              .failSend {
                z-index: 10;
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                margin: auto;
                display: inline-block;
                height: 22px;
                width: 22px;
                border-radius: 11px;
              }
              span.chatContent {
                background: #9eea6a;
              }
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
      user-select: none;
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
    ::v-deep.el-dialog {
      margin-left: 142px;
    }
  }
}
</style>
