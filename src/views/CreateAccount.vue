<template>
  <div class="create-account-container">
    <v-container class="fill-height d-flex align-center justify-center">
      <v-card class="card-width" elevation="8">
        <!-- Header -->
        <div class="login-header">
          <div class="logo-circle">
            <v-icon size="48" class="text-white">mdi-chat-bubble-multiple</v-icon>
          </div>
          <v-card-title class="text-center text-h4 text-white font-weight-bold mt-3 mb-1">
            NO WA
          </v-card-title>
          <v-card-subtitle class="text-center text-white-70 mb-0">
            Connect with everyone in your network
          </v-card-subtitle>
        </div>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-form @submit.prevent="handleLogin">
            <!-- Username Field -->
            <v-text-field
              v-model="username"
              label="Username"
              prepend-inner-icon="mdi-account-circle"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              :disabled="isLoading"
              :error="!!usernameError"
              :error-messages="usernameError"
              @input="usernameError = ''"
              @keyup.enter="handleLogin"
              placeholder="Enter your username"
            />

            <!-- Animal Preview Card -->
            <v-expand-transition>
              <v-card 
                v-if="username.length >= 3" 
                class="mb-4 animal-preview-card"
                elevation="2"
              >
                <v-card-text class="pa-4 text-center">
                  <p class="text-caption text-grey mb-2">
                    <v-icon size="x-small" class="mr-1">mdi-sparkles</v-icon>
                    Your random animal profile
                  </p>
                  <div class="d-flex align-center justify-center gap-2">
                    <span class="text-h4">{{ randomAnimal?.split(' ')[0] }}</span>
                    <div class="text-left">
                      <div class="font-weight-bold text-body2">{{ username }}</div>
                      <div class="text-caption text-grey">{{ randomAnimal?.split(' ').slice(1).join(' ') }}</div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-expand-transition>
            <p class="text-caption text-grey mb-6">
              <v-icon size="x-small" class="mr-1">mdi-information</v-icon>
              Minimum 3 characters. New users will be created automatically.
            </p>

            <!-- Login Button -->
            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="isLoading"
              class="login-btn font-weight-bold"
              append-icon="mdi-arrow-right"
            >
              <span>Enter Chat</span>
            </v-btn>

            <!-- Features List -->
            <div class="features-list mt-6">
              <div class="feature-item">
                <v-icon size="small" color="primary">mdi-shield-check</v-icon>
                <span class="text-caption">Secure & Real-time</span>
              </div>
              <div class="feature-item">
                <v-icon size="small" color="primary">mdi-network</v-icon>
                <span class="text-caption">Network Chat</span>
              </div>
              <div class="feature-item">
                <v-icon size="small" color="primary">mdi-history</v-icon>
                <span class="text-caption">Message History</span>
              </div>
            </div>

            <!-- Error Alert -->
            <v-expand-transition>
              <v-alert
                v-if="error"
                type="error"
                closable
                class="mt-6 alert-error"
                @click:close="error = ''"
                icon="mdi-alert-circle"
                prominent
              >
                {{ error }}
              </v-alert>
            </v-expand-transition>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { getUserByUsername, createUser, updateUserUuid } from '@/services/firebase'
import { getRandomAnimal } from '@/utils/animals'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const randomAnimal = ref<string | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const usernameError = ref<string | null>(null)

// Generate a random animal preview when username has valid length
watch(username, (newUsername) => {
  if (newUsername.length >= 3) {
    randomAnimal.value = getRandomAnimal()
  } else {
    randomAnimal.value = null
  }
})

async function handleLogin() {
  // Validation
  if (!username.value.trim()) {
    usernameError.value = 'Username is required'
    return
  }

  if (username.value.trim().length < 3) {
    usernameError.value = 'Username must be at least 3 characters'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const trimmedUsername = username.value.trim()
    
    // Check if username exists
    let user = await getUserByUsername(trimmedUsername)
    
    if (user) {
      // User exists - update UUID for new session
      user = await updateUserUuid(user.id, trimmedUsername)
    } else {
      // User doesn't exist - create new user with selected animal
      user = await createUser(trimmedUsername, randomAnimal.value || undefined)
    }

    // Set user and save session
    authStore.setUser(user)

    // Redirect to chat
    router.push('/chat')
  } catch (err) {
    error.value = `Failed to login: ${err instanceof Error ? err.message : 'Unknown error'}`
    console.error('Error logging in:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Container and layout */
.create-account-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Animated background effect */
.create-account-container::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  z-index: 0;
}

.create-account-container::after {
  content: '';
  position: absolute;
  bottom: -50%;
  left: -5%;
  width: 350px;
  height: 350px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite reverse;
  z-index: 0;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(30px);
  }
}

/* Card styling */
.card-width {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Login header */
.login-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 24px;
  text-align: center;
  position: relative;
}

/* Logo circle */
.logo-circle {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  backdrop-filter: blur(10px);
  animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
  }
  70% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.login-header :deep(.v-card-title) {
  color: white !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
}

.login-header :deep(.v-card-subtitle) {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 0.9rem !important;
  font-weight: 300 !important;
}

/* Divider */
.card-width :deep(.v-divider) {
  opacity: 0.3;
}

/* Text field styling */
:deep(.v-text-field) {
  margin-bottom: 16px;
}

:deep(.v-text-field.v-input--disabled) {
  opacity: 0.5;
}

:deep(.v-text-field .v-input__prepend-inner) {
  margin-top: 0;
}

/* Helper text */
.text-grey {
  color: #999 !important;
}

/* Features list */
.features-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(102, 126, 234, 0.05);
  transition: all 0.3s ease;
  animation: slideInUp 0.6s ease-out backwards;
}

.feature-item:nth-child(1) {
  animation-delay: 0.1s;
}

.feature-item:nth-child(2) {
  animation-delay: 0.2s;
}

.feature-item:nth-child(3) {
  animation-delay: 0.3s;
}

.feature-item:hover {
  background: rgba(102, 126, 234, 0.15);
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.feature-item .text-caption {
  color: #555;
  text-align: center;
  font-size: 0.75rem !important;
  font-weight: 500;
}

/* Login button */
.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  padding: 12px 24px !important;
  height: 48px !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: left 0.3s ease;
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4) !important;
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn :deep(.v-icon) {
  margin-left: 8px;
}

/* Error alert */
.alert-error {
  border-radius: 8px !important;
  animation: slideDown 0.4s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animal preview card */
.animal-preview-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%) !important;
  border: 2px solid rgba(102, 126, 234, 0.2) !important;
  border-radius: 12px !important;
  animation: slideInUp 0.4s ease-out;
}

/* Responsive design */
@media (max-width: 480px) {
  .card-width {
    max-width: 90%;
    margin: 16px;
  }

  .login-header {
    padding: 24px 16px;
  }

  .logo-circle {
    width: 64px;
    height: 64px;
  }

  .features-list {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .feature-item {
    flex-direction: row;
    justify-content: flex-start;
    padding: 8px 12px;
  }

  .feature-item .text-caption {
    text-align: left;
  }
}
</style>
