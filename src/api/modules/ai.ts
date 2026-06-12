/**
 * AI 对话 API
 */

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatResponse {
  reply: string
}

/**
 * 发送消息获取回复（非流式）
 */
export async function sendMessage(messages: Message[]): Promise<ChatResponse> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messages })
  })

  if (!response.ok) {
    throw new Error('AI 服务异常')
  }

  return response.json()
}

/**
 * 发送消息获取流式回复（SSE）
 * @param messages 消息列表
 * @param onChunk 每收到一个数据块就回调
 * @param onDone 结束时回调
 * @param onError 错误时回调
 */
export async function sendMessageStream(
  messages: Message[],
  onChunk: (content: string) => void,
  onDone: () => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const response = await fetch('/api/ai/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })

    if (!response.ok) {
      throw new Error('AI 服务异常')
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('无法读取响应流')
    }

    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim()

          if (data === '[DONE]') {
            onDone()
            return
          }

          try {
            const parsed = JSON.parse(data)
            if (parsed.content) {
              onChunk(parsed.content)
            }
            if (parsed.error) {
              onError(parsed.error)
              return
            }
          } catch {
            // 忽略解析错误
          }
        }
      }
    }

    onDone()
  } catch (error: any) {
    onError(error.message || 'AI 服务异常')
  }
}