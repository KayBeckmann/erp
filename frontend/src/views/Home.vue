<!-- frontend/src/views/Home.vue -->
<template>
  <div>
    <Menu />
    <h2 v-if="username">Willkommen, {{ username }}!</h2>
    <h2 v-else>Willkommen auf der Startseite</h2>
    <p>Dies ist die Hauptansicht für alle Benutzer.</p>
  </div>
</template>

<script>
import Menu from '../components/Menu.vue';

export default {
  name: 'Home',
  components: {
    Menu
  },
  computed: {
    username() {
      const token = localStorage.getItem('token');
      if (!token) return '';
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.username;
      } catch (e) {
        return '';
      }
    }
  }
}
</script>
