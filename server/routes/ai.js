import express from 'express'
import { chatStream, chat } from '../services/ai.js'

const router = express.Router()

// 存储对话历史（内存中，生产环境用 Redis）
const conversationHistory = new Map()

// SSE 流式对话
router.post('/chat/stream', async (req, res) => {
  const { sessionId, messages } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages 参数必填' })
  }

  // 设置 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')

  // 限制历史消息数量（最近 10 轮）
  const limitedMessages = messages.slice(-10)

  await chatStream(limitedMessages, res)
})

// 非流式对话
router.post('/chat', async (req, res) => {
  const { messages } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages 参数必填' })
  }

  try {
    // 限制历史消息数量
    const limitedMessages = messages.slice(-10)
    const reply = await chat(limitedMessages)
    res.json({ reply })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: error.message || 'AI 服务异常' })
  }
})

// 清空对话历史
router.delete('/history/:sessionId', (req, res) => {
  const { sessionId } = req.params
  conversationHistory.delete(sessionId)
  res.json({ success: true })
})

export default router