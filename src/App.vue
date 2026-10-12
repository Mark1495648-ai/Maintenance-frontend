<script setup>
import { ref, onMounted, watch } from 'vue';
import { maintenanceApi } from './api';
import StatsBar from './components/StatsBar.vue';
import MaintenanceForm from './components/MaintenanceForm.vue';
import MaintenanceList from './components/MaintenanceList.vue';

const records = ref([]);
const stats = ref({});
const editingRecord = ref(null);
const loading = ref(false);
const saving = ref(false);
const errorMessage = ref('');

const search = ref('');
const statusFilter = ref('');
const priorityFilter = ref('');

async function loadRecords() {
  loading.value = true;
  try {
    records.value = await maintenanceApi.list({
      status: statusFilter.value,
      priority: priorityFilter.value,
      search: search.value,
    });
  } catch (err) {
    errorMessage.value = `Could not load records. ${err.message}`;
  } finally {
    loading.value = false;
  }
}

async function loadStats() {
  try {
    stats.value = await maintenanceApi.stats();
  } catch (err) {
    errorMessage.value = `Could not load summary. ${err.message}`;
  }
}

// Reload the list and the summary numbers after any change.
async function refresh() {
  errorMessage.value = '';
  await Promise.all([loadRecords(), loadStats()]);
}

async function saveRecord(formData) {
  saving.value = true;
  errorMessage.value = '';
  try {
    if (editingRecord.value) {
      await maintenanceApi.update(editingRecord.value.id, formData);
      editingRecord.value = null;
    } else {
      await maintenanceApi.create(formData);
    }
    await refresh();
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    saving.value = false;
  }
}

async function markCompleted(record) {
  errorMessage.value = '';
  try {
    await maintenanceApi.update(record.id, { ...record, status: 'completed' });
    await refresh();
  } catch (err) {
    errorMessage.value = err.message;
  }
}

async function deleteRecord(record) {
  if (!window.confirm(`Delete the record for "${record.equipment_name}"?`)) return;
  errorMessage.value = '';
  try {
    await maintenanceApi.remove(record.id);
    if (editingRecord.value?.id === record.id) editingRecord.value = null;
    await refresh();
  } catch (err) {
    errorMessage.value = err.message;
  }
}

// Reload when the filters change (search is debounced).
let searchTimer;
watch(search, () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(loadRecords, 300);
});
watch([statusFilter, priorityFilter], loadRecords);

onMounted(refresh);
</script>

<template>
  <main class="container">
    <header>
      <h1>🔧 Equipment Maintenance Tracker</h1>
      <p class="subtitle">Schedule, track and complete maintenance work on your equipment.</p>
    </header>

    <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>

    <StatsBar :stats="stats" />

    <div class="layout">
      <MaintenanceForm
        :record="editingRecord"
        :saving="saving"
        @submit="saveRecord"
        @cancel="editingRecord = null"
      />

      <section>
        <div class="filters">
          <input v-model="search" type="search" placeholder="Search equipment, task or technician..." />
          <select v-model="statusFilter">
            <option value="">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
          <select v-model="priorityFilter">
            <option value="">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <p v-if="loading" class="empty">Loading...</p>
        <MaintenanceList
          v-else
          :records="records"
          @edit="editingRecord = $event"
          @delete="deleteRecord"
          @complete="markCompleted"
        />
      </section>
    </div>
  </main>
</template>
