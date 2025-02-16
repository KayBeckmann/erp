<!-- frontend/src/components/Login.vue -->
<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label>Username:</label>
        <input v-model="username" type="text" />
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          username: this.username,
          password: this.password
        });
        localStorage.setItem('token', response.data.token);
        this.$router.push('/');
      } catch (err) {
        this.error = 'Ungültige Anmeldedaten';
      }
    }
  }
}
</script>
