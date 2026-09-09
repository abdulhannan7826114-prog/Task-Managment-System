import request from 'supertest';
import app from '../../server.js';
import User from '../../models/User.js';
import Task from '../../models/Task.js';

let token;
let userId;

describe('Task Controller', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    token = registerRes.body.token;
    userId = registerRes.body.user.id;
  });

  describe('POST /api/tasks', () => {
    test('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Task',
          description: 'This is a test',
          priority: 'High'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.task).toHaveProperty('title', 'Test Task');
      expect(res.body.task).toHaveProperty('status', 'Todo');
    });

    test('should fail without auth token', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task'
        });

      expect(res.statusCode).toBe(401);
    });

    test('should fail without title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'No title'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Task 1',
          priority: 'High'
        });

      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Task 2',
          priority: 'Low'
        });
    });

    test('should get all user tasks', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.tasks.length).toBe(2);
      expect(res.body.count).toBe(2);
    });

    test('should fail without auth token', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Original Title',
          status: 'Todo'
        });

      taskId = createRes.body.task._id;
    });

    test('should update a task', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          status: 'In Progress'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.task.title).toBe('Updated Title');
      expect(res.body.task.status).toBe('In Progress');
    });

    test('should fail to update non-existent task', async () => {
      const res = await request(app)
        .put('/api/tasks/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated'
        });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Task to Delete'
        });

      taskId = createRes.body.task._id;
    });

    test('should delete a task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);

      const getRes = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(getRes.body.count).toBe(0);
    });

    test('should fail to delete non-existent task', async () => {
      const res = await request(app)
        .delete('/api/tasks/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });
});
