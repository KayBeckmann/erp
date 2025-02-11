<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="username">Benutzername:</label>
        <input type="text" id="username" v-model="username" />
      </div>
      <div>
        <label for="password">Passwort:</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <button type="submit">Anmelden</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
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
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: this.username, password: this.password })
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          this.$router.push({ name: 'Home' });
        } else {
          this.error = data.message || 'Login fehlgeschlagen';
        }
      } catch (err) {
        this.error = 'Fehler bei der Anmeldung';
      }
    }
  }
}
</script>
