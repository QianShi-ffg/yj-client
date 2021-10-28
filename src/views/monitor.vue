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
            <li v-for="(item, i) in messageList" :class="item.uuid === uuid ? 'right' : 'left'" :key="`item${i}`">
              <span :id="`spanText${i}`">{{ show(item.text, i) }}</span>
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
      <div class="bottom">
        <!-- <el-input
          type="textarea"
          v-model="textarea"
          placeholder=""
          :autosize="{ minRows: 2, maxRows: 3 }"
          :spellcheck="false"
        ></el-input> -->
        <div
          id="input"
          contenteditable="true"
          style="width: 100%; min-hight: 70px; max-height: 100px"
          :spellcheck="false"
        ></div>
        <div class="btn">
          <el-button type="success" size="mini" @click="submit">发送</el-button>
        </div>
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
      socket: null,
      scrollTop: null,
      uuid: null
    }
  },
  mounted() {
    // this.socket = new WebSocket('ws://192.73.0.211:3010')
    this.socket = new WebSocket('ws://188.131.164.41:3010')
    this.text = document.getElementById('input')
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
    },
    submit() {
      // let text = document.getElementById('input')
      this.textarea = this.text.innerHTML
      this.socket.send(JSON.stringify({ text: this.textarea, uuid: this.uuid }))
    },
    refresh(value) {
      console.log(value)
      this.messageList.push(value)
      this.text.innerHTML = ''
      console.log(233666)
    },
    show(value, i) {
      this.$nextTick(() => {
        let childList = []
        document.getElementById(`spanText${i}`).innerHTML = value
        childList = [...document.getElementById(`spanText${i}`).children]
        childList.forEach((item) => {
          if (item.tagName === 'IMG') {
            if (item.clientWidth > document.getElementById(`spanText${i}`).clientWidth) {
              item.style.width = '100%'
            }
          }
        })
      })
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
          // background: #f5f5f5;

          li {
            // display: block;
            list-style: none;
            margin: 10px 0;
            padding-left: 20px;
            // text-align: left;
            span {
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
            }
            &.right {
              padding-right: 20px;
              text-align: right;
              span {
                background: #9eea6a;
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
    .bottom {
      display: flex;
      box-sizing: border-box;
      padding: 0 10px 0;
      margin-top: 30px;
      height: 115px;
      #input {
        height: 100px;
        overflow-y: auto;
        border: none;
        resize: none;
        font-size: 18px;
        font-weight: 400;
        text-align: left;
        padding: 0 10px 0 5px;
        box-sizing: border-box;
        line-height: 30px;
        &::-webkit-scrollbar {
          display: none;
        }
        &:focus-visible {
          outline: none;
        }
      }
      .btn {
        position: relative;
        width: 100px;
        height: 100%;
        .el-button {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 27px;
          margin: 0 10px 0 10px;
        }
      }
    }
  }
}
</style>
