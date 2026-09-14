import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import { connectTestDb, clearTestDb, closeTestDb } from './setup/db.js';

describe('Auth API', () => {
  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  describe('POST /api/auth/register', () => {
    it('returns 400 when a required field is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'nimali@nsbm.lk', password: 'pass123' });

      expect(res.status).toBe(400);
    });

    it('creates a user and returns a token, without leaking the password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Nimali',
        email: 'nimali@nsbm.lk',
        jobTitle: 'Developer',
        password: 'pass123',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('nimali@nsbm.lk');
      expect(res.body.user.password).toBeUndefined();
    });

    it('returns 409 when the email is already registered', async () => {
      await User.create({
        name: 'Existing',
        email: 'dup@nsbm.lk',
        jobTitle: 'QA',
        password: 'whatever',
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'New',
        email: 'dup@nsbm.lk',
        jobTitle: 'QA',
        password: 'pass123',
      });

      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Nimali',
        email: 'nimali@nsbm.lk',
        jobTitle: 'Developer',
        password: 'pass123',
        role: 'employee',
      });
    });

    it('returns 400 when email or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nimali@nsbm.lk' });

      expect(res.status).toBe(400);
    });

    it('returns 401 for a wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nimali@nsbm.lk', password: 'wrong-password' });

      expect(res.status).toBe(401);
    });

    it('returns 401 for an email that does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@nsbm.lk', password: 'whatever' });

      expect(res.status).toBe(401);
    });

    it('returns a token and the safe user on correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nimali@nsbm.lk', password: 'pass123' });

      expect(res.status).toBe(200);
      expect(typeof res.body.token).toBe('string');
      expect(res.body.user).toMatchObject({
        email: 'nimali@nsbm.lk',
        role: 'employee',
      });
      expect(res.body.user.password).toBeUndefined();
    });
  });
});
