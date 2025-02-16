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
          <label>Gruppen (kommagetrennt):</label>
          <input v-model="form.groupsInput" type="text" placeholder="z.B. Admin,Mitarbeiter" required />
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
        groupsInput: this.user ? this.user.groups.join(',') : '',
        address: this.user ? this.user.address : '',
        healthInsurance: this.user ? this.user.healthInsurance : '',
        taxNumber: this.user ? this.user.taxNumber : '',
        taxClass: this.user ? this.user.taxClass : '',
        weeklyHours: this.user ? this.user.weeklyHours : 0,
        wageSalary: this.user ? this.user.wageSalary : 0
      }
    }
  },
  methods: {
    save() {
      // Konvertiere die Gruppenangabe in ein Array
      const groups = this.form.groupsInput.split(',').map(g => g.trim()).filter(g => g);
      const payload = {
        username: this.form.username,
        ...(this.mode === 'new' && { password: this.form.password }),
        groups: groups,
        address: this.form.address,
        healthInsurance: this.form.healthInsurance,
        taxNumber: this.form.taxNumber,
        taxClass: this.form.taxClass,
        weeklyHours: this.form.weeklyHours,
        wageSalary: this.form.wageSalary
      };
      this.$emit('save', payload);
    }
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
</style>
