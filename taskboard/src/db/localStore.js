import PouchDB from 'pouchdb-browser';

const db = new PouchDB('syncboard-tasks');

export async function getAllLocalTasks() {
  const result = await db.allDocs({ include_docs: true });
  return result.rows.map((row) => row.doc);
}

export async function putLocalTask(task) {
  try {
    const existing = await db.get(task._id);
    return db.put({ ...task, _rev: existing._rev });
  } catch (err) {
    if (err.status === 404) return db.put(task);
    throw err;
  }
}

export async function removeLocalTask(id) {
  try {
    const existing = await db.get(id);
    return db.remove(existing);
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

export default db;