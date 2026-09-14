import { getAllLocalTasks, putLocalTask } from './localStore';
import * as tasksApi from '../api/tasksApi';

const PENDING_KEY = 'pendingMoves';

function toLocalDoc(serverTask, extra = {}) {
  return {
    _id: `task:${serverTask._id}`,
    mongoId: serverTask._id,
    title: serverTask.title,
    description: serverTask.description,
    priority: serverTask.priority,
    status: serverTask.status,
    assignee: serverTask.assignee,
    assigneeEmail: serverTask.assigneeEmail,
    version: serverTask.version,
    updatedAt: serverTask.updatedAt,
    conflict: false,
    ...extra,
  };
}

function toAppTask(localDoc) {
  return {
    id: localDoc.mongoId,
    title: localDoc.title,
    description: localDoc.description,
    priority: localDoc.priority,
    status: localDoc.status,
    assignee: localDoc.assignee,
    assigneeEmail: localDoc.assigneeEmail,
    version: localDoc.version,
    date: localDoc.updatedAt ? localDoc.updatedAt.split('T')[0] : '',
    conflict: !!localDoc.conflict,
    conflictStatus: localDoc.conflictStatus || null,
  };
}

function getPending() {
  return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
}

function savePending(list) {
  localStorage.setItem(PENDING_KEY, JSON.stringify(list));
}

function queuePendingMove(mongoId, toStatus, version) {
  const pending = getPending().filter((p) => p.mongoId !== mongoId);
  pending.push({ mongoId, toStatus, version });
  savePending(pending);
}

function clearPendingMove(mongoId) {
  savePending(getPending().filter((p) => p.mongoId !== mongoId));
}

export async function syncFromServer() {
  const serverTasks = await tasksApi.getTasks();
  for (const task of serverTasks) {
    await putLocalTask(toLocalDoc(task));
  }
}

export async function loadLocalTasks() {
  const docs = await getAllLocalTasks();
  return docs.map(toAppTask);
}

export async function moveTaskLocalFirst(mongoId, toStatus) {
  const docs = await getAllLocalTasks();
  const doc = docs.find((d) => d.mongoId === mongoId);
  if (!doc) throw new Error('Task not found locally');

  const previousStatus = doc.status;

  await putLocalTask({ ...doc, status: toStatus });

  try {
    const updated = await tasksApi.moveTask(mongoId, toStatus, doc.version);
    await putLocalTask(toLocalDoc(updated));
    clearPendingMove(mongoId);
    return { ok: true };
  } catch (err) {
    if (err.status === 409) {
      const current = err.data?.current;
      await putLocalTask(
        toLocalDoc(current || { ...doc, status: previousStatus }, {
          conflict: true,
          conflictStatus: toStatus,
        })
      );
      clearPendingMove(mongoId);
      return { ok: false, conflict: true };
    }
    queuePendingMove(mongoId, toStatus, doc.version);
    return { ok: false, offline: true };
  }
}

export async function resolveConflict(mongoId) {
  const docs = await getAllLocalTasks();
  const doc = docs.find((d) => d.mongoId === mongoId);
  if (!doc) return;
  await putLocalTask({ ...doc, conflict: false, conflictStatus: null });
}

export async function flushPendingMoves() {
  const pending = getPending();
  for (const p of pending) {
    await moveTaskLocalFirst(p.mongoId, p.toStatus);
  }
}