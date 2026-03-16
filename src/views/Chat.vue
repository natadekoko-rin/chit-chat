<template>
  <div class="chat-container">
    <!-- App Bar Header -->
    <v-app-bar class="gradient-header" elevation="4">
      <v-container class="d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-3">
          <div class="logo-badge">
            <v-icon size="x-large" class="text-white">mdi-chat-bubble-multiple</v-icon>
          </div>
          <div>
            <h1 class="text-white text-h5 font-weight-bold">NO WA</h1>
            <div class="d-flex gap-3">
              <p class="text-caption text-white mb-0">
                <v-icon size="x-small" class="mr-1">mdi-message-multiple</v-icon>
                {{ chatStore.messages.length }} messages
              </p>
              <p class="text-caption text-white mb-0">
                <v-icon size="x-small" class="mr-1">mdi-account-multiple</v-icon>
                {{ chatStore.users.length }} online
              </p>
            </div>
          </div>
        </div>

        <div class="d-flex align-center gap-3">
          <v-chip 
            class="user-chip"
            color="white" 
            text-color="primary"
            size="large"
            prepend-icon="mdi-crown"
          >
            <span class="mr-2">{{ authStore.user?.animal }}</span>
            <span class="font-weight-bold">{{ authStore.user?.username }}</span>
          </v-chip>
          <v-btn 
            color="white"
            variant="outlined"
            size="small"
            append-icon="mdi-logout"
            @click="handleLogout"
            class="logout-btn-text"
            title="Logout"
          >
            Logout
          </v-btn>
          <v-btn 
            icon="mdi-logout" 
            variant="text"
            color="white"
            size="small" 
            @click="handleLogout"
            class="logout-btn"
            title="Logout"
          />
        </div>
      </v-container>
    </v-app-bar>

    <v-container class="chat-content">
      <!-- Messages Display -->
      <div class="messages-container" ref="messagesContainer">
        <div v-if="chatStore.messages.length === 0" class="empty-state">
          <v-icon size="80" color="primary" opacity="0.3">mdi-chat-outline</v-icon>
          <p class="text-subtitle2 text-grey mt-4">No messages yet</p>
          <p class="text-caption text-grey">Start the conversation! 👋</p>
        </div>

        <transition-group name="message" tag="div" class="messages-list">
          <div v-for="message in chatStore.messages" :key="message.id" class="message-wrapper">
            <div
              :class="[
                'message-item',
                isCurrentUser(message.userId) ? 'sent' : 'received',
              ]"
            >
              <v-card 
                :class="['message-card', isCurrentUser(message.userId) ? 'message-sent' : 'message-received']"
                elevation="1"
              >
                <v-card-text class="pa-3">
                  <div class="d-flex justify-space-between align-start mb-2">
                    <div class="d-flex align-center gap-2">
                      <span class="text-h5" style="line-height: 1;">{{ message.animal }}</span>
                      <div>
                        <strong class="text-body2 d-block">{{ message.username }}</strong>
                        <span class="text-caption text-grey">{{ message.animal?.split(' ').slice(1).join(' ') }}</span>
                      </div>
                    </div>
                    <span class="text-caption text-grey time-stamp">
                      {{ formatTime(message.timestamp) }}
                    </span>
                  </div>
                  <p class="message-content mb-0">{{ message.content }}</p>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- Message Input -->
      <div class="input-section">
        <v-form @submit.prevent="handleSendMessage" class="w-100">
          <div class="input-wrapper">
            <v-text-field
              v-model="messageInput"
              label="Type a message..."
              variant="outlined"
              density="compact"
              :disabled="isLoading"
              hide-details
              class="message-input"
              prepend-inner-icon="mdi-message-outline"
              @keyup.enter="handleSendMessage"
            />
            <v-btn
              type="submit"
              icon
              color="primary"
              :loading="isLoading"
              :disabled="!messageInput.trim() || isLoading"
              size="large"
              class="send-btn"
              title="Send message (Enter)"
              variant="elevated"
            >
              <v-icon size="large" color="white">mdi-send-circle</v-icon>
            </v-btn>
          </div>
        </v-form>

        <v-expand-transition>
          <v-alert
            v-if="error"
            type="error"
            closable
            class="mt-3 alert-error"
            @click:close="error = ''"
            icon="mdi-alert-circle"
          >
            {{ error }}
          </v-alert>
        </v-expand-transition>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useChatStore } from '@/stores/chatStore'
import { sendMessage, getMessages, subscribeToMessages, subscribeToUsers, deleteUserByUsername } from '@/services/firebase'

const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()

const messageInput = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)

function isCurrentUser(userId: string): boolean {
  return userId === authStore.user?.id
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

async function handleSendMessage() {
  if (!messageInput.value.trim() || !authStore.user) {
    return
  }

  isLoading.value = true
  error.value = null

  try {
    await sendMessage(authStore.user.id, authStore.user.username, authStore.user.animal, messageInput.value.trim())
    messageInput.value = ''
    
    // Scroll to bottom after new message
    await nextTick()
    scrollToBottom()
  } catch (err) {
    error.value = `Failed to send message: ${err instanceof Error ? err.message : 'Unknown error'}`
    console.error('Error sending message:', err)
  } finally {
    isLoading.value = false
  }
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

async function handleLogout() {
  try {
    // Delete user from Firebase when logging out
    if (authStore.user?.username) {
      await deleteUserByUsername(authStore.user.username)
    }
  } catch (err) {
    console.error('Error deleting user on logout:', err)
  }

  authStore.logout()
  chatStore.unsubscribeFromUpdates()
  router.push('/create-account')
}

// Load initial messages and subscribe to updates
onMounted(async () => {
  try {
    // Load initial messages
    const initialMessages = await getMessages()
    chatStore.setMessages(initialMessages)
    
    await nextTick()
    scrollToBottom()

    // Subscribe to real-time updates
    const unsubscribe = subscribeToMessages((messages) => {
      chatStore.setMessages(messages)
      nextTick(() => {
        scrollToBottom()
      })
    })

    chatStore.setUnsubscribe(unsubscribe)

    // Subscribe to users list for counting
    const unsubscribeUsers = subscribeToUsers((users) => {
      chatStore.setUsers(users)
    })

    chatStore.setUnsubscribeUsers(unsubscribeUsers)
  } catch (err) {
    error.value = `Failed to load messages: ${err instanceof Error ? err.message : 'Unknown error'}`
    console.error('Error loading messages:', err)
  }
})

onUnmounted(() => {
  chatStore.unsubscribeFromUpdates()
})

// Auto-scroll when messages change
watch(
  () => chatStore.messages.length,
  async () => {
    await nextTick()
    scrollToBottom()
  }
)
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f1f4f9 100%);
}

.gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.logo-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.user-chip {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.logout-btn-text {
  border-color: rgba(255, 255, 255, 0.8) !important;
  color: white !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.logout-btn-text:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-color: white !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2) !important;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  gap: 1.5rem;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.message-wrapper {
  display: flex;
  animation: slideIn 0.3s ease-out;
}

.message-item {
  display: flex;
  width: 100%;
}

.message-item.sent {
  justify-content: flex-end;
}

.message-item.received {
  justify-content: flex-start;
}

.message-card {
  max-width: 70%;
  word-break: break-word;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.message-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-sent {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-sent .message-content {
  color: white;
}

.message-sent .time-stamp {
  color: rgba(255, 255, 255, 0.7);
}

.message-sent :deep(.v-icon) {
  color: #fff !important;
}

.message-received {
  background-color: white;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.message-content {
  font-size: 0.95rem;
  line-height: 1.4;
}

.input-section {
  padding: 1rem 1.5rem 1.5rem;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.input-wrapper {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}

.message-input {
  flex: 1;
}

.send-btn {
  height: 48px !important;
  width: 48px !important;
  flex-shrink: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
  transition: all 0.3s ease !important;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.08);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6) !important;
}

.send-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.alert-error {
  border-radius: 8px;
  border-left: 4px solid #f44336;
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-enter-active {
  animation: slideIn 0.3s ease-out;
}

/* Scrollbar styling */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 1rem;
}

.w-100 {
  width: 100%;
}
</style>
