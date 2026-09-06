import {
  getAllTasks,
  getTaskById,
  addTask,
  updateTaskStatus,
  deleteTask as deleteTaskRecord,
} from '../data/mockTasks.js';
import { Task } from '../models/Task.js';

export async function getTasks(req, res) {
  const { status } = req.query;
  let tasks = await getAllTasks();

  if (status) {
    tasks = tasks.filter((t) => t.status === status);
  }

  res.json(tasks);
}

export async function getTaskStats(req, res) {
  const stats = await Task.aggregate([
    {
      $group: {
        _id: { assignee: '$assignee', status: '$status' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.assignee',
        statuses: { $push: { status: '$_id.status', count: '$count' } },
        total: { $sum: '$count' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(stats);
}

export async function createTask(req, res) {
  const { title, description, priority, assignee, assigneeEmail } = req.body;

  if (!title || !assigneeEmail) {
    return res.status(400).json({ message: 'title and assigneeEmail are required' });
  }

  const task = await addTask({ title, description, priority, assignee, assigneeEmail });
  res.status(201).json(task);
}


export async function moveTask(req, res) {
  const { id } = req.params;
  const { toStatus, version } = req.body;
  const allowedStatuses = ['todo', 'doing', 'done'];

  if (!allowedStatuses.includes(toStatus)) {
    return res.status(400).json({ message: 'toStatus must be one of todo, doing, done' });
  }

  const task = await Task.findById(id).lean();

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (task.assigneeEmail !== req.user.email) {
    return res.status(403).json({ message: 'Only the assigned employee can move this task' });
  }

  const updated = await Task.findOneAndUpdate(
    { _id: id, version },
    { $set: { status: toStatus }, $inc: { version: 1 } },
    { new: true }
  ).lean();

  if (!updated) {
    const current = await Task.findById(id).lean();
    return res.status(409).json({
      message: 'Task was modified by someone else',
      current,
    });
  }

  res.json(updated);
}

export async function deleteTask(req, res) {
  const { id } = req.params;
  const ok = await deleteTaskRecord(id);

  if (!ok) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.status(204).send();
}