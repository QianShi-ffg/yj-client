<template>
  <div class="chat-input">
    <div class="left">
      <div
        id="editor"
        ref="editor"
        contenteditable="true"
        :class="editorClass"
        :style="editorStyle"
        @paste.prevent="handlePaste($event)"
        @keyup="handleKeyUp($event)"
        @keydown="handleKeyDown($event)"
      >
        <br />
      </div>
      <div><i v-show="loading" class="el-icon-loading" /></div>
    </div>
  </div>
</template>

<script>
/**
 * 聊天输入框
 * events
 * change   function(value)
 * enter    function
 *
 * methods
 * clean    function
 * focus    function
 */
// import axios from 'axios'

export default {
  name: 'ChatInput',
  props: {
    editorClass: {
      type: String,
      default: ''
    },
    editorStyle: {
      type: Object,
      default: () => ({})
    },
    imgShowWidth: {
      // 聊天输入框中粘贴的图片显示的宽度
      type: Number,
      default: 50
    },
    imgShowHeight: {
      // 聊天输入框中粘贴的图片显示的高度
      type: Number,
      default: 50
    },
    // uploadUrl: {
    //   type: String,
    //   default: 'https://imio.jd.com/uploadfile/file/uploadImg.action'
    // },
    name: {
      // 上传 表单 name
      type: String,
      default: 'upload'
    },
    enter: {
      // 是否支持回车， 目前还有个 bug 中文输入后，在结尾回车，需要回车两次
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      msgList: [],
      loading: false
    }
  },
  methods: {
    async handlePaste(event) {
      const pasteResult = this.handlePastePlainText(event.clipboardData)
      if (pasteResult) return
      await this.handlePasteImageFile(event.clipboardData)
    },

    handleKeyUp(event) {
      const childNodes = event.target.childNodes
      this.emitChange(childNodes)
      if (event.keyCode === 13) {
        this.$emit('enter')
      }
    },

    handleKeyDown(event) {
      if (event.keyCode === 13) {
        // 禁止换行默认行为
        event.preventDefault()
        if (this.enter) {
          const oBr = document.createElement('br')
          this.cursorInsert(oBr)
        }
      }
    },

    // 去格式粘贴 文本
    handlePastePlainText(clipboardData) {
      const text = clipboardData.getData('text/plain')
      if (text) {
        const textNode = document.createTextNode(text)
        this.cursorInsert(textNode)
        return true
      }
      return false
    },

    // 粘贴图片
    async handlePasteImageFile(clipboardData) {
      const img = this.getPasteImageFile(clipboardData.files)
      if (!img) return
      const uploadRes = await this.uploadChatImg(img)
      if (!uploadRes) {
        this.$message.error('图片上传失败,请重新上传')
        return
      }
      const oImage = await this.getImageObject(uploadRes, this.imgShowWidth, this.imgShowHeight)
      this.cursorInsert(oImage)
      // 光标处插入 image 后，重新出发 emit 时间
      const oEditor = this.$refs.editor
      this.emitChange(oEditor.childNodes)
    },

    emitChange(editorChildNodes) {
      const oldMsgList = JSON.parse(JSON.stringify(this.msgList))
      this.msgList = [] // 重置
      for (let i = 0; i < editorChildNodes.length; i++) {
        if (editorChildNodes[i].nodeType === 1 && editorChildNodes[i].nodeName === 'BR') {
          // 处理回车
          const lastMsg = this.msgList[this.msgList.length - 1]
          if (lastMsg?.type === 'text') {
            lastMsg.content += '\n'
          }
        } else if (editorChildNodes[i].nodeType === 3 && editorChildNodes[i].nodeValue) {
          const lastMsg = this.msgList[this.msgList.length - 1]
          if (lastMsg?.type === 'text') {
            lastMsg.content += editorChildNodes[i].nodeValue
          } else {
            this.msgList.push({
              type: 'text',
              content: editorChildNodes[i].nodeValue
            })
          }
        } else if (editorChildNodes[i].nodeType === 1 && editorChildNodes[i].nodeName === 'IMG') {
          const dataset = editorChildNodes[i].dataset
          this.msgList.push({
            type: 'image',
            url: editorChildNodes[i].src,
            width: +dataset.width,
            height: +dataset.height
          })
        }
      }
      if (!this.msgList.length && !oldMsgList.length) {
        return
      }
      this.$emit('change', [...this.msgList])
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

    /**
     * 上传聊天图片
     * @param file
     * @return {Promise<null|{width: number, height: number, length: number, md5: string, path: string}>}
     */
    // async uploadChatImg(file) {
    //   const formData = new FormData()
    //   formData.append(this.name, file)
    //   this.loading = true
    //   try {
    //     const resp = await axios.post(this.uploadUrl, formData)
    //     if (resp.status === 200 && resp.data.code === 0) {
    //       return resp.data
    //     }
    //     return null
    //   } catch (e) {
    //     return null
    //   } finally {
    //     this.loading = false
    //   }
    // },
    // 获取一个 image object
    getImageObject(uploadRes, showWidth, showHeight) {
      const oImage = new Image(showWidth, showHeight)
      const datasetFields = ['width', 'height']
      datasetFields.forEach((field) => {
        oImage.setAttribute(`data-${field}`, uploadRes[field])
      })
      oImage.src = uploadRes.path
      return oImage
    },
    // 清除 输入框
    clean() {
      this.$refs.editor.innerHTML = ''
    },
    // 输入框 焦点
    focus() {
      this.$refs.editor.focus()
    }
  }
}
</script>

<style scoped lang="scss">
.chat-input {
  display: flex;
  border: 1px solid #dcdfe6;
  .left {
    width: 100%;
    div:nth-of-type(1) {
      padding: 4px;
      width: 300px;
      min-height: 100px;
      outline: none;
    }
  }
}
</style>
