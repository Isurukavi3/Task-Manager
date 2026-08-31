import {
  getAllTasks,
  getTaskById,
  addTask,
  updateTaskStatus,
  deleteTask as deleteTaskRecord,
} from '../data/mockTasks.js';

export function getTasks(req, res) {
  const { status } = req.query;
  let tasks = getAllTasks();

  if (status) {
    tasks = tasks.filter((t) => t.status === status);
  }

  res.json(tasks);
}

export function createTask(req, res) {
  const { title, description, priority, assignee, assigneeEmail } = req.body;

  if (!title || !assigneeEmail) {
    return res.status(400).json({ message: 'title and assigneeEmail are required' });
  }

  const task = addTask({ title, description, priority, assignee, assigneeEmail });
  res.status(201).json(task);
}

export function moveTask(req, res) {
  const { id } = req.params;
  const { toStatus } = req.body;
  const allowedStatuses = ['todo', 'doing', 'done'];

  if (!allowedStatuses.includes(toStatus)) {
    return res.status(400).json({ message: 'toStatus must be one of todo, doing, done' });
  }

  const task = getTaskById(id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (task.assigneeEmail !== req.user.email) {
    return res.status(403).json({ message: 'Only the assigned employee can move this task' });
  }

  const updated = updateTaskStatus(id, toStatus);
  res.json(updated);
}

export function deleteTask(req, res) {
  const { id } = req.params;
  const ok = deleteTaskRecord(id);

  if (!ok) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.status(204).send();
}
