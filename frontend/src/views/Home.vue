<!-- frontend/src/views/Home.vue -->
<template>
  <div>
    <Menu />
    <h2>Willkommen auf der Startseite</h2>
    <p>Dies ist die Hauptansicht für alle Benutzer.</p>
  </div>
</template>

<script>
import Menu from '../components/Menu.vue';

export default {
  name: 'Home',
  components: {
    Menu
  }
}
</script>
