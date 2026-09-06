import { apiFetch } from './client';

export function getTasks() {
  return apiFetch('/tasks');
}

export function addTask(taskData) {
  return apiFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

export function moveTask(id, toStatus, version) {
  return apiFetch(`/tasks/${id}/move`, {
    method: 'PATCH',
    body: JSON.stringify({ toStatus, version }),
  });
}

export function deleteTask(id) {
  return apiFetch(`/tasks/${id}`, { method: 'DELETE' });
}