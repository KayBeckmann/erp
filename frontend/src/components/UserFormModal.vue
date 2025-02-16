<!-- frontend/src/components/UserFormModal.vue -->
<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>{{ mode === 'edit' ? 'Benutzer bearbeiten' : 'Neuen Benutzer anlegen' }}</h3>
      <form @submit.prevent="save">
        <div>
          <label>Username:</label>
          <input v-model="form.username" type="text" :disabled="mode === 'edit'" required />
        </div>
        <div v-if="mode === 'new'">
          <label>Password:</label>
          <input v-model="form.password" type="password" required />
        </div>
        <div>
          <label>Gruppen:</label>
          <div class="dropdown" @click="toggleDropdown">
            <button type="button">{{ selectedGroupsText }}</button>
            <div v-if="dropdownOpen" class="dropdown-content" @click.stop>
              <div v-for="group in availableGroups" :key="group.id">
                <label>
                  <input type="checkbox" :value="group.name" v-model="form.groups" />
                  {{ group.name }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div>
          <label>Adresse:</label>
          <input v-model="form.address" type="text" />
        </div>
        <div>
          <label>Krankenkasse:</label>
          <input v-model="form.healthInsurance" type="text" />
        </div>
        <div>
          <label>Steuernummer:</label>
          <input v-model="form.taxNumber" type="text" />
        </div>
        <div>
          <label>Steuerklasse:</label>
          <input v-model="form.taxClass" type="text" />
        </div>
        <div>
          <label>Wochenstunden:</label>
          <input v-model.number="form.weeklyHours" type="number" step="0.1" />
        </div>
        <div>
          <label>Stundenlohn / Gehalt:</label>
          <input v-model.number="form.wageSalary" type="number" step="0.01" />
        </div>
        <div class="modal-actions">
          <button type="submit">Speichern</button>
          <button type="button" @click="$emit('close')">Abbrechen</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'UserFormModal',
  props: {
    user: {
      type: Object,
      default: null
    },
    mode: {
      type: String,
      default: 'new' // 'new' oder 'edit'
    }
  },
  data() {
    return {
      form: {
        username: this.user ? this.user.username : '',
        password: '',
        groups: this.user ? this.user.groups.slice() : [],
        address: this.user ? this.user.address : '',
        healthInsurance: this.user ? this.user.healthInsurance : '',
        taxNumber: this.user ? this.user.taxNumber : '',
        taxClass: this.user ? this.user.taxClass : '',
        weeklyHours: this.user ? this.user.weeklyHours : 0,
        wageSalary: this.user ? this.user.wageSalary : 0
      },
      availableGroups: [],
      dropdownOpen: false
    }
  },
  computed: {
    selectedGroupsText() {
      return this.form.groups.length ? this.form.groups.join(', ') : 'Keine Gruppe ausgewählt'
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    async fetchAvailableGroups() {
      try {
        const response = await axios.get('http://localhost:3000/api/groups', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        })
        this.availableGroups = response.data
      } catch (error) {
        console.error('Fehler beim Laden der Gruppen:', error)
      }
    },
    save() {
      const payload = {
        username: this.form.username,
        ...(this.mode === 'new' && { password: this.form.password }),
        groups: this.form.groups,
        address: this.form.address,
        healthInsurance: this.form.healthInsurance,
        taxNumber: this.form.taxNumber,
        taxClass: this.form.taxClass,
        weeklyHours: this.form.weeklyHours,
        wageSalary: this.form.wageSalary
      }
      this.$emit('save', payload)
    }
  },
  mounted() {
    this.fetchAvailableGroups()
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  width: 400px;
}
.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.modal-actions button {
  margin-left: 10px;
}
.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown button {
  padding: 5px 10px;
}
.dropdown-content {
  position: absolute;
  background-color: #f9f9f9;
  min-width: 200px;
  border: 1px solid #ccc;
  z-index: 1;
  max-height: 150px;
  overflow-y: auto;
  padding: 5px;
}
.dropdown-content div {
  margin-bottom: 5px;
}
</style>
