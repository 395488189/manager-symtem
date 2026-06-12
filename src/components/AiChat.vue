<template>
  <div class="ai-chat">
    <!-- 悬浮按钮 -->
    <div v-if="!isOpen" class="fab" @click="toggleOpen">
      <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="9">
        <el-icon><ChatDotRound /></el-icon>
      </el-badge>
    </div>

    <!-- 对话面板 -->
    <transition name="slide">
      <div v-if="isOpen" class="chat-panel">
        <!-- 头部 -->
        <div class="panel-header">
          <div class="header-info">
            <el-icon class="ai-icon"><MagicStick /></el-icon>
            <span class="ai-title">AI 医疗助手</span>
          </div>
          <div class="header-actions">
            <el-button text @click="clearHistory" title="清空对话">
              <el-icon><Delete /></el-icon>
            </el-button>
            <el-button text @click="toggleOpen">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </div>

        <!-- 对话区域 -->
        <div class="chat-messages" ref="messagesRef">
          <!-- 欢迎消息 -->
          <div v-if="messages.length === 0" class="welcome-message">
            <el-icon class="welcome-icon"><ChatDotRound /></el-icon>
            <p>您好！我是 AI 医疗助手"小医"</p>
            <p>可以帮您解答医疗健康问题、用药咨询等</p>
            <div class="quick-questions">
              <el-tag
                v-for="q in quickQuestions"
                :key="q"
                class="quick-tag"
                @click="sendQuickQuestion(q)"
              >
                {{ q }}
              </el-tag>
            </div>
          </div>

          <!-- 消息列表 -->
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message', msg.role]"
          >
            <div class="message-avatar">
              <el-icon v-if="msg.role === 'user'"><User /></el-icon>
              <el-icon v-else><MagicStick /></el-icon>
            </div>
            <div class="message-content">
              <div class="message-bubble">
                <template v-if="msg.role === 'assistant' && index === messages.length - 1 && isTyping">
                  {{ msg.content }}<span class="typing-cursor">|</span>
                </template>
                <template v-else>
                  {{ msg.content }}
                </template>
              </div>
            </div>
          </div>

          <!-- 加载中 -->
          <div v-if="isLoading" class="message assistant">
            <div class="message-avatar">
              <el-icon><MagicStick /></el-icon>
            </div>
            <div class="message-content">
              <div class="message-bubble loading">
                <span class="loading-dot">·</span>
                <span class="loading-dot">·</span>
                <span class="loading-dot">·</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input">
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="2"
            placeholder="输入您的问题..."
            resize="none"
            @keydown.enter.exact.prevent="handleSend"
          />
          <el-button
            type="primary"
            :disabled="!inputText.trim() || isLoading"
            :loading="isLoading"
            @click="handleSend"
          >
            发送
          </el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { ChatDotRound, MagicStick, Close, Delete, User } from '@element-plus/icons-vue'
import { sendMessageStream } from '@/api/modules/ai'
import { ElMessage } from 'element-plus'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// 状态
const isOpen = ref(false)
const messages = ref<Message[]>([])
const inputText = ref('')
const isLoading = ref(false)
const isTyping = ref(false)
const unreadCount = ref(0)
const messagesRef = ref<HTMLElement>()

// 快捷问题
const quickQuestions = [
  '阿司匹林有什么副作用？',
  '儿童发烧怎么处理？',
  '高血压患者饮食注意什么？',
  '如何预防流感？'
]

// 切换面板
function toggleOpen() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
    scrollToBottom()
  }
}

// 清空历史
function clearHistory() {
  messages.value = []
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

// 发送消息
function handleSend() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: text
  })
  inputText.value = ''
  scrollToBottom()

  // 发送请求
  isLoading.value = true
  isTyping.value = false

  sendMessageStream(
    messages.value,
    // onChunk - 流式接收
    (content) => {
      const lastMsg = messages.value[messages.value.length - 1]
      if (messages.value.length > 0 && lastMsg?.role === 'assistant') {
        lastMsg.content += content
      } else {
        messages.value.push({
          role: 'assistant',
          content: content
        })
      }
      console.log('Received chunk:', messages, content)
      isTyping.value = true
      scrollToBottom()
    },
    // onDone
    () => {
      isLoading.value = false
      isTyping.value = false
    },
    // onError
    (error) => {
      isLoading.value = false
      isTyping.value = false
      ElMessage.error(error)
    }
  )
}

// 快捷问题
function sendQuickQuestion(question: string) {
  inputText.value = question
  handleSend()
}

// 监听新消息
watch(() => messages.value.length, () => {
  if (!isOpen.value && messages.value.length > 0) {
    unreadCount.value++
  }
})
</script>

<style scoped>
.ai-chat {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9999;
}

/* 悬浮按钮 */
.fab {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  transition: transform 0.3s, box-shadow 0.3s;
}

.fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.fab .el-icon {
  font-size: 28px;
  color: #fff;
}

.fab :deep(.el-badge__content) {
  background: #f56c6c;
}

/* 聊天面板 */
.chat-panel {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 380px;
  height: 520px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 面板头部 */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-icon {
  font-size: 24px;
}

.ai-title {
  font-size: 16px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.header-actions .el-button {
  color: rgba(255, 255, 255, 0.8);
}

.header-actions .el-button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

/* 消息区域 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f5f7fa;
}

/* 欢迎消息 */
.welcome-message {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}

.welcome-icon {
  font-size: 48px;
  color: #667eea;
  margin-bottom: 16px;
}

.welcome-message p {
  margin: 8px 0;
  font-size: 14px;
}

.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 20px;
}

.quick-tag {
  cursor: pointer;
  padding: 8px 12px;
  font-size: 12px;
}

.quick-tag:hover {
  opacity: 0.8;
}

/* 消息 */
.message {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: #667eea;
  color: #fff;
}

.message.assistant .message-avatar {
  background: #67c23a;
  color: #fff;
}

.message-content {
  max-width: 70%;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.message.user .message-bubble {
  background: #667eea;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-bubble {
  background: #fff;
  color: #303133;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.message-bubble.loading {
  padding: 12px 16px;
}

.loading-dot {
  animation: bounce 1.4s infinite ease-in-out both;
  font-size: 20px;
  color: #909399;
}

.loading-dot:nth-child(1) { animation-delay: -0.32s; }
.loading-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* 打字光标 */
.typing-cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 输入区域 */
.chat-input {
  padding: 12px;
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.chat-input .el-textarea {
  flex: 1;
}

.chat-input .el-button {
  height: 68px;
}

/* 过渡动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>