import { Task } from '../models/Task.js';

export async function getAllTasks() {
  return Task.find().lean();
}

export async function getTaskById(id) {
  return Task.findById(id).lean();
}

export async function addTask(taskData) {
  const created = await Task.create(taskData);
  return created.toObject();
}

export async function updateTaskStatus(id, toStatus) {
  return Task.findByIdAndUpdate(id, { $set: { status: toStatus }, $inc: { version: 1 } }, { new: true }).lean();
}

export async function deleteTask(id) {
  const result = await Task.findByIdAndDelete(id);
  return !!result;
}

export default { getAllTasks, getTaskById, addTask, updateTaskStatus, deleteTask };