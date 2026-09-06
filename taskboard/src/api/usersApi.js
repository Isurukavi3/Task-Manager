import { apiFetch } from './client';

export function getEmployees() {
  return apiFetch('/users?role=employee');
}

export function updateUser(email, data) {
  return apiFetch(`/users/${encodeURIComponent(email)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
