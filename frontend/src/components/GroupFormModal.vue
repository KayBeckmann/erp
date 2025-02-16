<!-- frontend/src/components/GroupFormModal.vue -->
<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>{{ mode === 'edit' ? 'Gruppe bearbeiten' : 'Neue Gruppe anlegen' }}</h3>
      <form @submit.prevent="save">
        <div>
          <label>Name:</label>
          <input v-model="form.name" type="text" :disabled="mode === 'edit'" required />
        </div>
        <div>
          <label>Beschreibung:</label>
          <input v-model="form.description" type="text" />
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
  name: 'GroupFormModal',
  props: {
    group: {
      type: Object,
      default: null
    },
    mode: {
      type: String,
      default: 'new' // "new" oder "edit"
    }
  },
  data() {
    return {
      form: {
        name: this.group ? this.group.name : '',
        description: this.group ? this.group.description : ''
      }
    }
  },
  methods: {
    save() {
      const payload = {
        name: this.form.name,
        description: this.form.description
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
