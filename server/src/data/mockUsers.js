let users = [
  { email: 'isuru@gmail.com', password: 'isuru1234', name: 'Isuru Kavisanka', jobTitle: 'Manager', role: 'manager', profilePicture: null },
  { email: 'nadith@gmail.com', password: 'nadith1234', name: 'Nadith Dinsara', jobTitle: 'Software Developer', role: 'employee', profilePicture: null },
  { email: 'sahan@gmail.com', password: 'sahan1234', name: 'Dumidu Sahan', jobTitle: 'UI/UX Designer', role: 'employee', profilePicture: null },
  { email: 'manuja@gmail.com', password: 'manuja1234', name: 'Praveera Manuja', jobTitle: 'Backend Developer', role: 'employee', profilePicture: null },
];

export function getAllUsers() {
  return users;
}

export function findUserByEmail(email) {
  return users.find((u) => u.email === email);
}

export function addUser(newUser) {
  users.push(newUser);
  return newUser;
}

export function updateUser(email, updates) {
  const index = users.findIndex((u) => u.email === email);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  return users[index];
}

export default { getAllUsers, findUserByEmail, addUser, updateUser };
