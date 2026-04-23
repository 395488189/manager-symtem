import type { LoginParams, LoginResult } from '@/types/auth'

const MOCK_USERS = [
  { id: '1', username: 'admin', password: '123456', nickname: '管理员', avatar: '', role: 'admin' },
  { id: '2', username: 'doctor', password: '123456', nickname: '李医生', avatar: '', role: 'doctor' },
  { id: '3', username: 'nurse', password: '123456', nickname: '王护士', avatar: '', role: 'nurse' },
]

export async function login(params: LoginParams): Promise<LoginResult> {
  await new Promise(resolve => setTimeout(resolve, 500))

  const user = MOCK_USERS.find(u => u.username === params.username && u.password === params.password)
  if (!user) {
    throw new Error('用户名或密码错误')
  }

  return {
    token: `mock_token_${user.id}_${Date.now()}`,
    user: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      role: user.role,
    }
  }
}

export async function logout() {
  await new Promise(resolve => setTimeout(resolve, 200))
}