<!-- frontend/src/views/Groups.vue -->
<template>
  <div>
    <h3>Gruppenverwaltung</h3>
    <button @click="openNewGroupModal">Neue Gruppe anlegen</button>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Beschreibung</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="group in groups" :key="group.id">
          <td>{{ group.id }}</td>
          <td @click="openEditModal(group)" style="cursor:pointer;">{{ group.name }}</td>
          <td>{{ group.description }}</td>
          <td>
            <button @click="openEditModal(group)">Bearbeiten</button>
            <button @click="confirmDelete(group)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <GroupFormModal 
      v-if="showModal" 
      :group="selectedGroup" 
      :mode="modalMode" 
      @save="handleSave" 
      @close="closeModal" />
  </div>
</template>

<script>
import axios from 'axios'
import GroupFormModal from '../components/GroupFormModal.vue'

export default {
  name: 'Groups',
  components: {
    GroupFormModal
  },
  data() {
    return {
      groups: [],
      showModal: false,
      selectedGroup: null,
      modalMode: 'new'
    }
  },
  methods: {
    fetchGroups() {
      axios.get(`${import.meta.env.VITE_API_URL}/api/groups`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
      .then(response => {
        this.groups = response.data;
      })
      .catch(error => {
        console.error('Fehler beim Laden der Gruppen:', error);
      });
    },
    openEditModal(group) {
      this.selectedGroup = group;
      this.modalMode = 'edit';
      this.showModal = true;
    },
    openNewGroupModal() {
      this.selectedGroup = null;
      this.modalMode = 'new';
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    handleSave(payload) {
      if (this.modalMode === 'edit') {
        axios.put(`${import.meta.env.VITE_API_URL}/api/groups/${this.selectedGroup.id}`, payload, {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        })
        .then(() => {
          this.fetchGroups();
          this.closeModal();
        })
        .catch(error => {
          console.error('Fehler beim Aktualisieren der Gruppe:', error);
        });
      } else {
        axios.post(`${import.meta.env.VITE_API_URL}/api/groups`, payload, {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        })
        .then(() => {
          this.fetchGroups();
          this.closeModal();
        })
        .catch(error => {
          console.error('Fehler beim Erstellen der Gruppe:', error);
        });
      }
    },
    confirmDelete(group) {
      if (confirm(`Soll die Gruppe "${group.name}" wirklich gelöscht werden?`)) {
        axios.delete(`${import.meta.env.VITE_API_URL}/api/groups/${group.id}`, {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        })
        .then(() => {
          this.fetchGroups();
        })
        .catch(error => {
          console.error('Fehler beim Löschen der Gruppe:', error);
        });
      }
    }
  },
  mounted() {
    this.fetchGroups();
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
