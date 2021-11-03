<template>
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
      :contenteditable="true"
      @paste.prevent="chatPaste($event)"
      style="width: 100%; min-hight: 70px; max-height: 100px"
      :spellcheck="false"
    ></div>
    <div class="btn">
      <el-button type="success" size="mini" @click="beforeSubmit">发送</el-button>
    </div>
  </div>
</template>

<script>
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
      textList: []
    }
  },
  watch: {
    clean(newVal) {
      if (newVal) {
        this.textarea.innerHTML = ''
        this.$emit('textClean', false)
      }
    }
  },
  mounted() {
    this.textarea = document.getElementById('input')
  },
  methods: {
    async chatPaste(event) {
      const pasteRes = this.pasteText(event.clipboardData)
      if (pasteRes) {
        return
      } else {
        await this.pasteImageFile(event.clipboardData)
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
    cursorInsert(node) {
      // 获取光标范围
      const selObj = window.getSelection()
      const range = selObj.getRangeAt(0)
      // 光标处插入节点
      range.insertNode(node)
      // 取消insert node 后的选中状态，将光标恢复到 insert node 后面
      range.collapse(false)
    },
    beforeSubmit() {
      let list = [...this.textarea.childNodes]
      console.log(list)
      this.textList = []
      list.map((item) => {
        if (item.nodeType === 3) {
          console.log(this.textList, 2333)
          const lastMsg = this.textList[this.textList.length - 1]
          console.log(lastMsg, 333444)
          if (lastMsg?.type === 'text') {
            lastMsg.content += item.nodeValue
          } else {
            this.textList.push({
              type: 'text',
              text: item.nodeValue,
              uuid: this.uuid,
              nodeType: item.nodeType
            })
          }
        } else if (item.nodeType === 1) {
          if (item.nodeName === 'BR') {
            // 处理回车
            console.log(this.textList, 2333)
            const lastMsg = this.textList[this.textList.length - 1]
            console.log(lastMsg, 333444)
            if (lastMsg?.type === 'text') {
              lastMsg.content += '\n'
            }
          } else if (item.nodeName === 'IMG') {
            const dataset = item.dataset
            console.log(dataset, dataset.width, dataset.height)
            this.textList.push({
              type: 'image',
              nodeType: item.nodeType,
              url: item.src,
              uuid: this.uuid,
              style: { width: item.clientWidth, height: item.clientHeight }
            })
          }
        }
      })
      console.log(this.textList)
      this.$emit('submit', this.textList)
    }
    // emitChange(editorChildNodes) {
    //   const oldMsgList = JSON.parse(JSON.stringify(this.msgList))
    //   this.msgList = [] // 重置
    //   for (let i = 0; i < editorChildNodes.length; i++) {
    //     if (editorChildNodes[i].nodeType === 1 && editorChildNodes[i].nodeName === 'BR') {
    //       // 处理回车
    //       const lastMsg = this.msgList[this.msgList.length - 1]
    //       if (lastMsg?.type === 'text') {
    //         lastMsg.content += '\n'
    //       }
    //     } else if (editorChildNodes[i].nodeType === 3 && editorChildNodes[i].nodeValue) {
    //       const lastMsg = this.msgList[this.msgList.length - 1]
    //       if (lastMsg?.type === 'text') {
    //         lastMsg.content += editorChildNodes[i].nodeValue
    //       } else {
    //         this.msgList.push({
    //           type: 'text',
    //           content: editorChildNodes[i].nodeValue
    //         })
    //       }
    //     } else if (editorChildNodes[i].nodeType === 1 && editorChildNodes[i].nodeName === 'IMG') {
    //       const dataset = editorChildNodes[i].dataset
    //       this.msgList.push({
    //         type: 'image',
    //         url: editorChildNodes[i].src,
    //         width: +dataset.width,
    //         height: +dataset.height
    //       })
    //     }
    //   }
    //   if (!this.msgList.length && !oldMsgList.length) {
    //     return
    //   }
    //   this.$emit('change', [...this.msgList])
    // }
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
</style>
