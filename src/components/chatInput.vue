<template>
  <div class="bottom">
    <div
      ref="input"
      id="input"
      :contenteditable="true"
      @paste.prevent="chatPaste($event)"
      @keydown="keyDown($event)"
      style="width: 100%; min-hight: 70px; max-height: 100px"
      :spellcheck="false"
    ></div>
    <div class="btn">
      <el-button type="success" size="mini" @click="beforeSubmit">发送</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    uuid: String,
    clean: Boolean
  },
  data() {
    return {
      textarea: '',
      imgShowWidth: 50,
      imgShowHeight: 50,
      dataUrl: '',
      textList: [],
      keyList: []
    }
  },
  computed: {
    ...mapGetters('myClient', ['getCurrentEmoji', 'getIsDisplay', 'getRange'])
  },
  watch: {
    getIsDisplay(newVal) {
      if (newVal) {
        this.againFocus()
        // const range = selObj.getRangeAt(0)
        // 取消insert node 后的选中状态，将光标恢复到 insert node 后面
        // range.collapse(false)
        // selObj.collapseToEnd()
        console.log(this.getCurrentEmoji)
      }
    },
    clean(newVal) {
      if (newVal) {
        this.textarea.innerHTML = ''
        this.$emit('textClean', false)
      }
    }
  },
  mounted() {
    console.log(this.getCurrentEmoji)
    this.textarea = document.getElementById('input')
  },
  methods: {
    ...mapActions('myClient', ['setCurrentEmoji', 'setIsDisplay']),
    async chatPaste(event) {
      const pasteRes = this.pasteText(event.clipboardData)
      if (pasteRes) {
        return
      } else {
        await this.pasteImageFile(event.clipboardData)
      }
    },
    async againFocus() {
      await this.$refs.input.focus()
      await this.restoreSelection(this.getRange)
      const textNode = document.createTextNode(`[${this.getCurrentEmoji.value}]`)
      this.cursorInsert(textNode)
      this.setIsDisplay(false)
    },
    keyDown(event) {
      // const childNodes = event.target.childNodes
      // this.emitChange(childNodes)
      if (event.keyCode === 13) {
        event.cancelBubble = true
        event.preventDefault()
        event.stopPropagation()
        if (event.keyCode === 13) {
          if (event.shiftKey) {
            const oBr = document.createElement('br')
            this.cursorInsert(oBr)
          } else {
            this.beforeSubmit()
          }
          // this.keyList = []
          console.log(this.keyList.join())
        }
      }
    },
    // 去格式粘贴 文本
    pasteText(clipboardData) {
      console.log(clipboardData)
      const text = clipboardData.getData('text/plain')
      if (text) {
        const textNode = document.createTextNode(text)
        this.cursorInsert(textNode)
        return true
      }
      return false
    },
    // 粘贴图片
    async pasteImageFile(clipboardData) {
      const img = this.getPasteImageFile(clipboardData.files)
      if (!img) return
      let reader = new FileReader()
      reader.readAsDataURL(img) // 解析成base64格式
      reader.onload = () => {
        this.dataUrl = reader.result // 解析后的数据，如下图
        const oImage = this.getImageObject(this.dataUrl)
        this.cursorInsert(oImage)
      }
    },
    getImageObject(dataUrl, showWidth, showHeight) {
      const oImage = new Image(showWidth, showHeight)
      oImage.src = dataUrl
      return oImage
    },
    getPasteImageFile(clipboardDataFiles) {
      if (!clipboardDataFiles.length) {
        console.log('没有要粘贴的文件')
        return null
      }
      // 剪切版中选择的(用户第一个点的在尾)第一张图片
      const clipboardDataFileList = Array.from(clipboardDataFiles || [])
      let firstSelectedImage = null
      clipboardDataFileList.forEach((file) => {
        if (!file.type.match(/image\//i)) {
          return
        }
        firstSelectedImage = file
      })
      /**
       * 这里的 firstSelectedFile 对象就是和 <input type="file" /> onchange 时 一样的 文件对象
       * */
      return firstSelectedImage
    },
    // 光标处插入节点
    async cursorInsert(node) {
      // 获取光标范围
      const selObj = window.getSelection()
      console.log(selObj, selObj.toString(), selObj.getRangeAt(0), 89999)
      const range = selObj.getRangeAt(0)
      // 光标处插入节点
      range.insertNode(node)
      // 取消insert node 后的选中状态，将光标恢复到 insert node 后面
      // range.collapse(false)
      selObj.collapseToEnd()
    },
    beforeSubmit() {
      let list = [...this.textarea.childNodes]
      console.log(list)
      this.textList = []
      list.map((item) => {
        if (item.nodeType === 3 && item.nodeValue) {
          const lastMsg = this.textList[this.textList.length - 1]
          if (lastMsg?.type === 'text') {
            lastMsg.text += item.nodeValue
          } else {
            this.textList.push({
              type: 'text',
              text: item.nodeValue,
              uuid: this.uuid,
              toId: this.$route.params.id,
              nodeType: item.nodeType
            })
          }
        } else if (item.nodeType === 1) {
          if (item.nodeName === 'BR') {
            // 处理回车
            const lastMsg = this.textList[this.textList.length - 1]
            if (lastMsg?.type === 'text') {
              lastMsg.text += '</br>'
            }
          } else if (item.nodeName === 'IMG') {
            this.textList.push({
              type: 'image',
              nodeType: item.nodeType,
              url: item.src,
              uuid: this.uuid,
              toId: this.$route.params.id,
              style: { width: item.clientWidth, height: item.clientHeight }
            })
          }
        }
      })
      this.$emit('submit', this.textList)
    },
    // 恢复焦点位置
    restoreSelection(range) {
      if (range) {
        if (window.getSelection) {
          let sel = window.getSelection()
          sel.removeAllRanges()
          sel.addRange(range)
        } else if (document.selection && range.select) {
          range.select()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
    height: 90%;
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
</style>
