const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Small wrapper around fetch that throws an Error with the backend's message.
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = data.details ? `: ${data.details.join(', ')}` : '';
    throw new Error((data.error || 'Request failed') + details);
  }
  return data;
}

export const maintenanceApi = {
  list: ({ status = '', priority = '', search = '' } = {}) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (priority) params.set('priority', priority);
    if (search) params.set('search', search);
    const query = params.toString();
    return request(`/maintenance${query ? `?${query}` : ''}`);
  },
  stats: () => request('/maintenance/stats'),
  create: (record) => request('/maintenance', { method: 'POST', body: JSON.stringify(record) }),
  update: (id, record) => request(`/maintenance/${id}`, { method: 'PUT', body: JSON.stringify(record) }),
  remove: (id) => request(`/maintenance/${id}`, { method: 'DELETE' }),
};
