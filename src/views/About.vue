<template>
  <div>
    <chat-input
      ref="chat-input"
      :editor-style="{ width: '100%' }"
      @change="handleChatInputChange"
      @enter="handleChatSend"
    />
  </div>
</template>

<script>
import ChatInput from '@/components/chat'

export default {
  name: 'UseDemo',
  components: { ChatInput },
  data() {
    return {
      chatInputValue: []
    }
  },
  mounted() {
    // setTimeout(() => {
    //   this.chatInputFocus()
    //   this.chatInputClean()
    // }, 3000)
  },
  methods: {
    // 获取焦点
    chatInputFocus() {
      this.$refs['chat-input'].focus()
    },

    // 清空内容
    chatInputClean() {
      this.$refs['chat-input'].clean()
    },

    handleChatInputChange(value) {
      console.log('输入框的值变化', value)
      this.chatInputValue = value ?? []
    },

    async handleChatSend() {
      console.log('您按了 Enter 键')
      // ... 可用来 调接口 发送数据到后台
    }
  }
}
</script>

<style scoped></style>
