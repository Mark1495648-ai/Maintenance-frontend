<script setup>
const props = defineProps({
  records: { type: Array, required: true },
});
const emit = defineEmits(['edit', 'delete', 'complete']);

const STATUS_LABELS = {
  scheduled: 'Scheduled',
  in_progress: 'In progress',
  completed: 'Completed',
};

// Local date as YYYY-MM-DD, so it can be compared with the scheduled_date string.
const today = new Date().toLocaleDateString('en-CA');

function isOverdue(record) {
  return record.status !== 'completed' && record.scheduled_date < today;
}

function formatCost(cost) {
  return cost == null ? '-' : cost.toLocaleString('en-US', { style: 'currency', currency: 'THB' });
}
</script>

<template>
  <p v-if="props.records.length === 0" class="empty">No maintenance records found.</p>

  <ul v-else class="record-list">
    <li v-for="record in props.records" :key="record.id" class="card record" :class="{ overdue: isOverdue(record) }">
      <div class="record-info">
        <h3>{{ record.equipment_name }}</h3>
        <p class="task">{{ record.task }}</p>
        <p class="meta">
          <span class="badge" :class="record.status">{{ STATUS_LABELS[record.status] }}</span>
          <span class="badge priority" :class="record.priority">{{ record.priority }}</span>
          <span v-if="isOverdue(record)" class="badge overdue-badge">Overdue</span>
        </p>
        <p class="details">
          <span>Due {{ record.scheduled_date }}</span>
          <span v-if="record.category">{{ record.category }}</span>
          <span v-if="record.location">{{ record.location }}</span>
          <span v-if="record.technician">Tech: {{ record.technician }}</span>
          <span>Cost: {{ formatCost(record.cost) }}</span>
        </p>
      </div>
      <div class="actions">
        <button v-if="record.status !== 'completed'" @click="emit('complete', record)">Mark done</button>
        <button @click="emit('edit', record)">Edit</button>
        <button class="danger" @click="emit('delete', record)">Delete</button>
      </div>
    </li>
  </ul>
</template>
