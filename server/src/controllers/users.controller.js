import { getAllUsers, updateUser as updateUserRecord } from '../data/mockUsers.js';

function toSafeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

export function getUsers(req, res) {
  const { role } = req.query;
  let users = getAllUsers();

  if (role) {
    users = users.filter((u) => u.role === role);
  }

  res.json(users.map(toSafeUser));
}

export function updateUser(req, res) {
  const { email } = req.params;
  const isSelf = req.user.email === email;
  const isManager = req.user.role === 'manager';

  if (!isSelf && !isManager) {
    return res.status(403).json({ message: 'Not allowed to edit this profile' });
  }

  const updated = updateUserRecord(email, req.body);

  if (!updated) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(toSafeUser(updated));
}
