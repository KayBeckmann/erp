<!-- frontend/src/views/Admin.vue -->
<template>
  <div>
    <Menu />
    <h2>Admin Einstellungen</h2>
    <p>Wählen Sie ein Untermenü:</p>
    <ul>
      <li><router-link to="/admin/users">Benutzer verwalten</router-link></li>
      <li><router-link to="/admin/groups">Gruppen verwalten</router-link></li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
import Menu from '../components/Menu.vue';

export default {
  name: 'Admin',
  components: {
    Menu
  }
}
</script>
