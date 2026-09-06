import { User } from '../models/User.js';

export async function getAllUsers() {
  return User.find().lean();
}

export async function findUserByEmail(email) {
  return User.findOne({ email }).lean();
}

export async function addUser(newUser) {
  const created = await User.create(newUser);
  return created.toObject();
}

export async function updateUser(email, updates) {
  return User.findOneAndUpdate({ email }, updates, { new: true }).lean();
}

export default { getAllUsers, findUserByEmail, addUser, updateUser };