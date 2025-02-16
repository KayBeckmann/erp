<!-- frontend/src/views/Users.vue -->
<template>
  <div>
    <h3>Benutzerverwaltung</h3>
    <button @click="openNewUserModal">Neuen Benutzer anlegen</button>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Gruppen</th>
          <th>Adresse</th>
          <th>Krankenkasse</th>
          <th>Steuernummer</th>
          <th>Steuerklasse</th>
          <th>Wochenstunden</th>
          <th>Stundenlohn/Gehalt</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td @click="openEditModal(user)" style="cursor:pointer;">{{ user.username }}</td>
          <td>{{ user.groups.join(', ') }}</td>
          <td>{{ user.address }}</td>
          <td>{{ user.healthInsurance }}</td>
          <td>{{ user.taxNumber }}</td>
          <td>{{ user.taxClass }}</td>
          <td>{{ user.weeklyHours }}</td>
          <td>{{ user.wageSalary }}</td>
          <td>
            <button @click="openEditModal(user)">Bearbeiten</button>
            <button @click="confirmDelete(user)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <UserFormModal 
      v-if="showModal" 
      :user="selectedUser" 
      :mode="modalMode" 
      @save="handleSave" 
      @close="closeModal" />
  </div>
</template>

<script>
import axios from 'axios'
import UserFormModal from '../components/UserFormModal.vue'

export default {
  name: 'Users',
  components: {
    UserFormModal
  },
  data() {
    return {
      users: [],
      showModal: false,
      selectedUser: null,
      modalMode: 'new'
    }
  },
  methods: {
    fetchUsers() {
      axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
      .then(response => {
        this.users = response.data;
      })
      .catch(error => {
        console.error('Fehler beim Laden der Benutzer:', error);
      });
    },
    openEditModal(user) {
      this.selectedUser = user;
      this.modalMode = 'edit';
      this.showModal = true;
    },
    openNewUserModal() {
      this.selectedUser = null;
      this.modalMode = 'new';
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    handleSave(payload) {
      if (this.modalMode === 'edit') {
        axios.put(`${import.meta.env.VITE_API_URL}/api/users/${this.selectedUser.id}`, payload, {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        })
        .then(() => {
          this.fetchUsers();
          this.closeModal();
        })
        .catch(error => {
          console.error('Fehler beim Aktualisieren des Benutzers:', error);
        });
      } else {
        axios.post(`${import.meta.env.VITE_API_URL}/api/users`, payload, {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        })
        .then(() => {
          this.fetchUsers();
          this.closeModal();
        })
        .catch(error => {
          console.error('Fehler beim Erstellen des Benutzers:', error);
        });
      }
    },
    confirmDelete(user) {
      if (confirm(`Soll der Benutzer "${user.username}" wirklich gelöscht werden?`)) {
        axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        })
        .then(() => {
          this.fetchUsers();
        })
        .catch(error => {
          console.error('Fehler beim Löschen des Benutzers:', error);
        });
      }
    }
  },
  mounted() {
    this.fetchUsers();
  }
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  text-align: left;
}
button {
  margin-right: 5px;
}
</style>
