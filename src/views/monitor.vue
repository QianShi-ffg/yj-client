<template>
  <div id="monitor">
    <div class="left">
      <div class="header"></div>
      <div class="body">
        <div class="list">
          <div class="left">
            <img src="" alt="" />
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
      <!-- <div class="bottom"> -->
      <!-- <el-input
          type="textarea"
          v-model="textarea"
          placeholder=""
          :autosize="{ minRows: 2, maxRows: 3 }"
          :spellcheck="false"
        ></el-input> -->
      <!-- <div
          id="input"
          :contenteditable="true"
          @paste.prevent="chatPaste($event)"
          style="width: 100%; min-hight: 70px; max-height: 100px"
          :spellcheck="false"
        ></div>
        <div class="btn">
          <el-button type="success" size="mini" @click="submit">发送</el-button>
        </div>
      </div> -->
    </div>
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
    this.uuid = `15666${parseInt(Math.random() * 10000000)}`
  },
  methods: {
    init() {
      this.socket.addEventListener('open', (event) => {
        console.log('socket is open', event)
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

      // let list = [...this.text.childNodes]
      // console.log(list)
      // list.map((item) => {
      //   console.log(item.nodeValue)
      //   if (item.nodeType === 3) {
      //   } else if (item.nodeType === 1) {
      //     this.socket.send(
      //       JSON.stringify({
      //         text: item.src || item.innerText,
      //         uuid: this.uuid,
      //         nodeType: item.nodeType,
      //         tagName: item.tagName,
      //         style: { width: item.clientWidth, height: item.clientHeight }
      //       })
      //     )
      //   }
      // })
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
        'height: 100%;',
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
        value.text = `<img src=${value.text} width="${value.style.width > 180 ? 180 : value.style.width}px;"></img>`
      }
    },
    textClean(value) {
      this.clean = value
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
      }
    }
  }
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
