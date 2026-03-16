import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Message, User } from '@/types'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  let unsubscribeMessages: (() => void) | null = null
  let unsubscribeUsers: (() => void) | null = null

  function setMessages(newMessages: Message[]) {
    messages.value = newMessages
  }

  function addMessage(message: Message) {
    messages.value.push(message)
  }

  function setUsers(newUsers: User[]) {
    users.value = newUsers
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(err: string | null) {
    error.value = err
  }

  function clearError() {
    error.value = null
  }

  function subscribeToUpdates(callback: (messages: Message[]) => void) {
    return callback
  }

  function unsubscribeFromUpdates() {
    if (unsubscribeMessages) {
      unsubscribeMessages()
      unsubscribeMessages = null
    }
    if (unsubscribeUsers) {
      unsubscribeUsers()
      unsubscribeUsers = null
    }
  }

  function setUnsubscribe(fn: () => void) {
    unsubscribeMessages = fn
  }

  function setUnsubscribeUsers(fn: () => void) {
    unsubscribeUsers = fn
  }

  return {
    messages,
    users,
    isLoading,
    error,
    setMessages,
    addMessage,
    setUsers,
    setLoading,
    setError,
    clearError,
    subscribeToUpdates,
    unsubscribeFromUpdates,
    setUnsubscribe,
    setUnsubscribeUsers,
  }
})
