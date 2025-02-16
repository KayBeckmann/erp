<!-- frontend/src/components/Menu.vue -->
<template>
  <nav>
    <ul>
      <li>
        <router-link to="/home">Startseite</router-link>
      </li>
      <!-- Admin Menü nur anzeigen, wenn der Benutzer in der Gruppe "Admin" ist -->
      <li v-if="isAdmin">
        <router-link to="/admin">Admin</router-link>
        <ul>
          <li>
            <router-link to="/admin/users">Benutzer verwalten</router-link>
          </li>
          <li>
            <router-link to="/admin/groups">Gruppen verwalten</router-link>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Menu',
  computed: {
    isAdmin() {
      const token = localStorage.getItem('token');
      if (!token) return false;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.groups && payload.groups.includes('Admin');
      } catch (e) {
        return false;
      }
    }
  }
}
</script>

<style scoped>
nav ul {
  list-style-type: none;
  padding: 0;
}

nav li {
  display: inline-block;
  margin-right: 20px;
  position: relative;
}

nav li ul {
  display: none;
  position: absolute;
  list-style-type: none;
  padding: 0;
  background: #f0f0f0;
  top: 100%;
  left: 0;
}

nav li:hover ul {
  display: block;
}
</style>
