export interface User {
  id: string
  username: string
  password: string // Note: In production, this should be hashed
  animal: string
  createdAt: number
}

export interface ReplyTo {
  id: string
  username: string
  animal: string
  content: string
}

export interface Message {
  id: string
  userId: string
  username: string
  animal?: string
  content: string
  timestamp: number
  replyTo?: ReplyTo
}

export interface SessionData {
  username: string
  userId: string
  animal: string
}
