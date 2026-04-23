export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  user: {
    id: string
    username: string
    nickname: string
    avatar: string
    role: string
  }
}

export interface User {
  id: string
  username: string
  nickname: string
  avatar: string
  role: string
}