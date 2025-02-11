<template>
  <div>
    <h2>Dashboard</h2>
    <p>Willkommen, Du bist angemeldet.</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
}
</script>
