<script setup>
const props = defineProps({
  stats: { type: Object, required: true },
});

const items = [
  { key: 'total', label: 'Total' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'overdue', label: 'Overdue' },
];
</script>

<template>
  <div class="stats">
    <div v-for="item in items" :key="item.key" class="card stat" :class="item.key">
      <span class="stat-number">{{ props.stats[item.key] ?? 0 }}</span>
      <span class="stat-label">{{ item.label }}</span>
    </div>
  </div>
</template>
