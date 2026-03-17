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
            <span class="no-wa-title">
              <span class="no-wa-char">N</span><span class="no-wa-char clickable-o" @click="clearAllMessages" title="Clear Messages">O</span> <span class="no-wa-char clickable-a" @click="clearAllUsers" title="Clear Users">W</span><span class="no-wa-char">A</span>
            </span>
          </v-card-title>
          <v-card-subtitle class="text-center text-white-70 mb-0">
            Connect with everyone in your network
          </v-card-subtitle>
        </div>

        <v-divider></v-divider>

        <!-- Tabs for Login / Register -->
        <v-tabs v-model="currentTab" class="px-6 pt-4" color="primary">
          <v-tab value="login" prepend-icon="mdi-login">Login</v-tab>
          <v-tab value="register" prepend-icon="mdi-account-plus">Register</v-tab>
        </v-tabs>

        <v-card-text class="pa-6 pt-4">
          <!-- LOGIN TAB -->
          <v-window v-model="currentTab">
            <v-window-item value="login">
              <v-form @submit.prevent="handleLogin">
                <p class="text-body2 text-grey mb-4">
                  <v-icon size="x-small" class="mr-1">mdi-information</v-icon>
                  Enter your username and password to login
                </p>

                <!-- Username Field -->
                <v-text-field
                  v-model="loginForm.username"
                  label="Username"
                  prepend-inner-icon="mdi-account-circle"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  :disabled="isLoading"
                  :error="!!loginErrors.username"
                  :error-messages="loginErrors.username"
                  @input="loginErrors.username = ''"
                  placeholder="Enter your username"
                />

                <!-- Password Field -->
                <v-text-field
                  v-model="loginForm.password"
                  label="Password"
                  type="password"
                  prepend-inner-icon="mdi-lock"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  :disabled="isLoading"
                  :error="!!loginErrors.password"
                  :error-messages="loginErrors.password"
                  @input="loginErrors.password = ''"
                  @keyup.enter="handleLogin"
                  placeholder="Enter your password"
                />

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
                  <span>Login</span>
                </v-btn>

                <!-- Error Alert -->
                <v-expand-transition>
                  <v-alert
                    v-if="error && currentTab === 'login'"
                    type="error"
                    closable
                    class="mt-6"
                    icon="mdi-alert-circle"
                    prominent
                  >
                    {{ error }}
                  </v-alert>
                </v-expand-transition>
              </v-form>
            </v-window-item>

            <!-- REGISTER TAB -->
            <v-window-item value="register">
              <v-form @submit.prevent="handleRegister">
                <p class="text-body2 text-grey mb-4">
                  <v-icon size="x-small" class="mr-1">mdi-information</v-icon>
                  Create a new account with username and password
                </p>

                <!-- Username Field -->
                <v-text-field
                  v-model="registerForm.username"
                  label="Username"
                  prepend-inner-icon="mdi-account-circle"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  :disabled="isLoading"
                  :error="!!registerErrors.username"
                  :error-messages="registerErrors.username"
                  @input="registerErrors.username = ''; debouncedCheckUsername()"
                  placeholder="Enter your username (min 3 chars)"
                />

                <!-- Username availability indicator -->
                <v-expand-transition>
                  <div v-if="registerForm.username.length >= 3" class="mb-4">
                    <v-chip v-if="isCheckingUsername" size="small" class="mr-2">
                      <v-progress-circular size="16" width="2" indeterminate class="mr-2"></v-progress-circular>
                      Checking availability...
                    </v-chip>
                    <v-chip 
                      v-else-if="usernameAvailable" 
                      size="small" 
                      color="success" 
                      text-color="white"
                      prepend-icon="mdi-check-circle"
                    >
                      Username available
                    </v-chip>
                    <v-chip 
                      v-else 
                      size="small" 
                      color="error" 
                      text-color="white"
                      prepend-icon="mdi-close-circle"
                    >
                      Username already taken
                    </v-chip>
                  </div>
                </v-expand-transition>

                <!-- Password Field -->
                <v-text-field
                  v-model="registerForm.password"
                  label="Password"
                  type="password"
                  prepend-inner-icon="mdi-lock"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  :disabled="isLoading"
                  :error="!!registerErrors.password"
                  :error-messages="registerErrors.password"
                  @input="registerErrors.password = ''"
                  placeholder="Min 3 characters"
                />

                <!-- Confirm Password Field -->
                <v-text-field
                  v-model="registerForm.confirmPassword"
                  label="Confirm Password"
                  type="password"
                  prepend-inner-icon="mdi-lock-check"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  :disabled="isLoading"
                  :error="!!registerErrors.confirmPassword"
                  :error-messages="registerErrors.confirmPassword"
                  @input="registerErrors.confirmPassword = ''"
                  @keyup.enter="handleRegister"
                  placeholder="Confirm your password"
                />

                <!-- Animal Preview Card -->
                <v-expand-transition>
                  <v-card 
                    v-if="randomAnimal && registerForm.username.length >= 3" 
                    class="mb-4 animal-preview-card"
                    elevation="2"
                  >
                    <v-card-text class="pa-4 text-center">
                      <p class="text-caption text-grey mb-2">
                        <v-icon size="x-small" class="mr-1">mdi-sparkles</v-icon>
                        Your random animal profile
                      </p>
                      <div class="d-flex align-center justify-center gap-2">
                        <span class="text-h4">{{ randomAnimal }}</span>
                        <div class="text-left">
                          <div class="font-weight-bold text-body2">{{ registerForm.username }}</div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-expand-transition>

                <!-- Register Button -->
                <v-btn
                  type="submit"
                  color="success"
                  block
                  size="large"
                  :loading="isLoading"
                  :disabled="!usernameAvailable || isCheckingUsername"
                  class="login-btn font-weight-bold"
                  append-icon="mdi-account-plus"
                >
                  <span>Create Account</span>
                </v-btn>

                <!-- Error Alert -->
                <v-expand-transition>
                  <v-alert
                    v-if="error && currentTab === 'register'"
                    type="error"
                    closable
                    class="mt-6"
                    icon="mdi-alert-circle"
                    prominent
                  >
                    {{ error }}
                  </v-alert>
                </v-expand-transition>
              </v-form>
            </v-window-item>
          </v-window>

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
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Toast Notification -->
    <v-snackbar
      v-model="toastShow"
      :color="toastColor"
      timeout="3000"
      location="top"
      variant="tonal"
    >
      {{ toastMessage }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { loginUser, registerUser, getUserByUsername, cleanMessages, cleanUsers } from '@/services/firebase'
import { getRandomAnimal } from '@/utils/animals'

const router = useRouter()
const authStore = useAuthStore()

// Tab control
const currentTab = ref<'login' | 'register'>('login')

// Login form state
const loginForm = ref({
  username: '',
  password: '',
})

const loginErrors = ref({
  username: '',
  password: '',
})

// Register form state
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
})

const registerErrors = ref({
  username: '',
  password: '',
  confirmPassword: '',
})

// Shared state
const isLoading = ref(false)
const error = ref<string | null>(null)
const isCheckingUsername = ref(false)
const usernameAvailable = ref(false)
const randomAnimal = ref<string | null>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Toast notification state
const toastShow = ref(false)
const toastMessage = ref('')
const toastColor = ref('success')

function showToast(message: string, color: string = 'success') {
  toastMessage.value = message
  toastColor.value = color
  toastShow.value = true
}

// Watch register username for availability check
watch(
  () => registerForm.value.username,
  (newUsername) => {
    if (newUsername.length >= 3) {
      debouncedCheckUsername()
    } else {
      usernameAvailable.value = false
      randomAnimal.value = null
    }
  }
)

// Debounced username availability check
function debouncedCheckUsername() {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  isCheckingUsername.value = true
  debounceTimer = setTimeout(async () => {
    try {
      const user = await getUserByUsername(registerForm.value.username.trim())
      usernameAvailable.value = !user // Available if user doesn't exist
      
      if (usernameAvailable.value && registerForm.value.username.length >= 3) {
        randomAnimal.value = getRandomAnimal()
      } else {
        randomAnimal.value = null
      }
    } catch (err) {
      console.error('Error checking username:', err)
      usernameAvailable.value = false
      randomAnimal.value = null
    } finally {
      isCheckingUsername.value = false
    }
  }, 500)
}

// LOGIN handler
async function handleLogin() {
  error.value = null
  loginErrors.value = { username: '', password: '' }

  // Validation
  if (!loginForm.value.username.trim()) {
    loginErrors.value.username = 'Username is required'
    return
  }

  if (!loginForm.value.password) {
    loginErrors.value.password = 'Password is required'
    return
  }

  isLoading.value = true

  try {
    const user = await loginUser(loginForm.value.username, loginForm.value.password)
    
    // Set user and save session
    authStore.setUser(user)
    console.log(`✅ Login successful: ${user.username}`)

    // Redirect to chat
    router.push('/chat')
  } catch (err: any) {
    const errorMessage = err?.message || 'Login failed'
    error.value = errorMessage
    console.error('Login error:', err)
  } finally {
    isLoading.value = false
  }
}

// Clear all messages
async function clearAllMessages() {
  try {
    await cleanMessages()
    showToast('✅ All messages cleared successfully!', 'success')
  } catch (err) {
    console.error('Error clearing messages:', err)
    showToast('❌ Failed to clear messages', 'error')
  }
}

// Clear all users
async function clearAllUsers() {
  try {
    await cleanUsers()
    showToast('✅ All users cleared successfully!', 'success')
  } catch (err) {
    console.error('Error clearing users:', err)
    showToast('❌ Failed to clear users', 'error')
  }
}

// REGISTER handler
async function handleRegister() {
  error.value = null
  registerErrors.value = { username: '', password: '', confirmPassword: '' }

  // Validation
  if (!registerForm.value.username.trim()) {
    registerErrors.value.username = 'Username is required'
    return
  }

  if (registerForm.value.username.trim().length < 3) {
    registerErrors.value.username = 'Username must be at least 3 characters'
    return
  }

  if (!usernameAvailable.value) {
    registerErrors.value.username = 'Username is already taken'
    return
  }

  if (!registerForm.value.password) {
    registerErrors.value.password = 'Password is required'
    return
  }

  if (registerForm.value.password.length < 3) {
    registerErrors.value.password = 'Password must be at least 3 characters'
    return
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    registerErrors.value.confirmPassword = 'Passwords do not match'
    return
  }

  isLoading.value = true

  try {
    const user = await registerUser(
      registerForm.value.username,
      registerForm.value.password,
      randomAnimal.value || undefined
    )

    console.log(`✨ Account created: ${user.username}`)

    // Set user and save session
    authStore.setUser(user)

    // Redirect to chat
    router.push('/chat')
  } catch (err: any) {
    const errorMessage = err?.message || 'Registration failed'
    error.value = errorMessage
    console.error('Registration error:', err)
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

/* NO WA Title */
.no-wa-title {
  font-weight: 700;
  letter-spacing: 0.5px;
}

.no-wa-char {
  display: inline-block;
  transition: all 0.2s ease;
}

.clickable-o,
.clickable-a {
  cursor: pointer;
  position: relative;
  border-radius: 4px;
  padding: 2px 4px;
  transition: all 0.3s ease;
}

.clickable-o:hover,
.clickable-a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.clickable-o:active,
.clickable-a:active {
  transform: scale(0.95);
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
