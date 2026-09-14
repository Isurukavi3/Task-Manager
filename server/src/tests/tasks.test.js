import request from 'supertest';
import jwt from 'jsonwebtoken';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import app from '../src/app.js';
import { Task } from '../src/models/Task.js';
import { connectTestDb, clearTestDb, closeTestDb } from './setup/db.js';

function authHeader({ email = 'nimali@nsbm.lk', role = 'employee', name = 'Nimali' } = {}) {
  const token = jwt.sign({ email, role, name }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { Authorization: `Bearer ${token}` };
}

describe('Task API', () => {
  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });

  describe('POST /api/tasks', () => {
    it('returns 403 when a non-manager tries to create a task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set(authHeader({ role: 'employee' }))
        .send({ title: 'Write tests', assignee: 'Nimali', assigneeEmail: 'nimali@nsbm.lk' });

      expect(res.status).toBe(403);
    });

    it('lets a manager create a task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set(authHeader({ role: 'manager', email: 'manager@nsbm.lk' }))
        .send({ title: 'Write tests', assignee: 'Nimali', assigneeEmail: 'nimali@nsbm.lk' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Write tests');
      expect(res.body.status).toBe('todo');
    });

    it('returns 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set(authHeader({ role: 'manager' }))
        .send({ title: 'No assignee email' });

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/tasks/:id/move', () => {
    it('returns 403 when the caller is not the assigned employee', async () => {
      const task = await Task.create({
        title: 'Fix bug',
        assignee: 'Nimali',
        assigneeEmail: 'nimali@nsbm.lk',
      });

      const res = await request(app)
        .patch(`/api/tasks/${task._id}/move`)
        .set(authHeader({ email: 'someone-else@nsbm.lk' }))
        .send({ toStatus: 'doing', version: 0 });

      expect(res.status).toBe(403);
    });

    it('moves the task when the version is current', async () => {
      const task = await Task.create({
        title: 'Fix bug',
        assignee: 'Nimali',
        assigneeEmail: 'nimali@nsbm.lk',
      });

      const res = await request(app)
        .patch(`/api/tasks/${task._id}/move`)
        .set(authHeader({ email: 'nimali@nsbm.lk' }))
        .send({ toStatus: 'doing', version: 0 });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('doing');
    });

    it('returns 409 with the current task when the version is stale', async () => {
      const task = await Task.create({
        title: 'Fix bug',
        assignee: 'Nimali',
        assigneeEmail: 'nimali@nsbm.lk',
      });

      // Simulate a second client already moving the task first.
      await Task.findByIdAndUpdate(task._id, {
        $set: { status: 'doing' },
        $inc: { version: 1 },
      });

      const res = await request(app)
        .patch(`/api/tasks/${task._id}/move`)
        .set(authHeader({ email: 'nimali@nsbm.lk' }))
        .send({ toStatus: 'done', version: 0 }); // still holding the old version

      expect(res.status).toBe(409);
      expect(res.body.current.status).toBe('doing');
    });

    it('returns 400 for an invalid target status', async () => {
      const task = await Task.create({
        title: 'Fix bug',
        assignee: 'Nimali',
        assigneeEmail: 'nimali@nsbm.lk',
      });

      const res = await request(app)
        .patch(`/api/tasks/${task._id}/move`)
        .set(authHeader({ email: 'nimali@nsbm.lk' }))
        .send({ toStatus: 'archived', version: 0 });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('returns 404 for a task that does not exist', async () => {
      const res = await request(app)
        .delete('/api/tasks/507f1f77bcf86cd799439011')
        .set(authHeader());

      expect(res.status).toBe(404);
    });

    it('deletes an existing task', async () => {
      const task = await Task.create({
        title: 'Old task',
        assignee: 'Nimali',
        assigneeEmail: 'nimali@nsbm.lk',
      });

      const res = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set(authHeader());

      expect(res.status).toBe(204);

      const stillThere = await Task.findById(task._id);
      expect(stillThere).toBeNull();
    });
  });
});
