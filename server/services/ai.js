import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

// MiniMax API 配置（兼容 OpenAI 格式）
const client = new OpenAI({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: 'https://api.minimax.chat/v1'  // MiniMax OpenAI 兼容端点
})

// 医疗助手系统提示词
const SYSTEM_PROMPT = `你是一个专业的医疗助手，名为"小医"。你的职责是：

1. 回答用户关于疾病、症状、用药等医疗健康问题
2. 提供健康生活建议和预防保健知识
3. 辅助医生和护士进行日常工作咨询
4. 当涉及具体诊断和治疗时，建议用户咨询专业医生

注意：
- 只提供健康科普和常见问题解答
- 不做任何疾病的诊断
- 遇到紧急情况建议立即就医
- 回答要专业、温和、有耐心

当前对话在医院的医疗后台管理系统中使用，用户可能是医生、护士或医院工作人员。`

/**
 * 调用 AI 对话（流式）
 * @param {Array} messages - 对话消息 [{role: 'user'|'assistant', content: '...'}]
 * @param {ReadableStream} res - Express 响应对象（用于 SSE）
 */
export async function chatStream(messages, res) {
  try {
    // 构建完整消息列表（系统提示 + 历史 + 当前）
    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ]

    const stream = await client.chat.completions.create({
      model: 'MiniMax-Text-01',  // MiniMax 模型
      messages: fullMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 2000
    })

    // 流式返回
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`)
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    console.error('AI API Error:', error)
    res.write(`data: ${JSON.stringify({ error: error.message || 'AI 服务异常' })}\n\n`)
    res.end()
  }
}

/**
 * 调用 AI 对话（非流式）
 * @param {Array} messages - 对话消息
 * @returns {string} AI 回复内容
 */
export async function chat(messages) {
  const fullMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages
  ]

  const response = await client.chat.completions.create({
    model: 'MiniMax-Text-01',
    messages: fullMessages,
    stream: false,
    temperature: 0.7,
    max_tokens: 2000
  })

  return response.choices[0]?.message?.content || ''
}