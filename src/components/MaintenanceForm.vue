<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  // When set, the form edits this record; otherwise it creates a new one.
  record: { type: Object, default: null },
  saving: { type: Boolean, default: false },
});
const emit = defineEmits(['submit', 'cancel']);

const emptyForm = () => ({
  equipment_name: '',
  category: '',
  location: '',
  task: '',
  priority: 'medium',
  status: 'scheduled',
  technician: '',
  scheduled_date: '',
  cost: '',
});

const form = reactive(emptyForm());

watch(
  () => props.record,
  (record) => {
    Object.assign(
      form,
      emptyForm(),
      record
        ? {
            equipment_name: record.equipment_name,
            category: record.category ?? '',
            location: record.location ?? '',
            task: record.task,
            priority: record.priority,
            status: record.status,
            technician: record.technician ?? '',
            scheduled_date: record.scheduled_date,
            cost: record.cost ?? '',
          }
        : {}
    );
  },
  { immediate: true }
);

function handleSubmit() {
  emit('submit', { ...form });
  if (!props.record) Object.assign(form, emptyForm());
}
</script>

<template>
  <form class="card form" @submit.prevent="handleSubmit">
    <h2>{{ record ? 'Edit maintenance record' : 'Add maintenance record' }}</h2>

    <label>
      Equipment name *
      <input v-model="form.equipment_name" required maxlength="150" placeholder="e.g. Air compressor #2" />
    </label>

    <div class="row">
      <label>
        Category
        <input v-model="form.category" maxlength="60" placeholder="HVAC, Vehicle..." />
      </label>
      <label>
        Location
        <input v-model="form.location" maxlength="100" placeholder="Building A" />
      </label>
    </div>

    <label>
      Task *
      <textarea v-model="form.task" required rows="3" placeholder="What needs to be done?"></textarea>
    </label>

    <div class="row">
      <label>
        Priority
        <select v-model="form.priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <label>
        Status
        <select v-model="form.status">
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </label>
    </div>

    <div class="row">
      <label>
        Scheduled date *
        <input v-model="form.scheduled_date" type="date" required />
      </label>
      <label>
        Cost (THB)
        <input v-model="form.cost" type="number" min="0" step="0.01" placeholder="0.00" />
      </label>
    </div>

    <label>
      Technician
      <input v-model="form.technician" maxlength="100" placeholder="Assigned to" />
    </label>

    <div class="actions">
      <button class="primary" type="submit" :disabled="saving">
        {{ saving ? 'Saving...' : record ? 'Save changes' : 'Add record' }}
      </button>
      <button v-if="record" type="button" @click="emit('cancel')">Cancel</button>
    </div>
  </form>
</template>
