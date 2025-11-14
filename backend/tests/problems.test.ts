import request from 'supertest';
import app from '../src/app';
import { Problem } from '../src/models/Problem';
import { User } from '../src/models/User';
import { Tag } from '../src/models/Tag';
import jwt from 'jsonwebtoken';

describe('Problem API Integration Tests', () => {
  let authToken: string;
  let adminToken: string;
  let userId: string;
  let adminId: string;
  let tagId: string;

  beforeAll(async () => {
    // Create test user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    });
    userId = user._id.toString();
    authToken = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test-secret');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });
    adminId = admin._id.toString();
    adminToken = jwt.sign({ id: adminId }, process.env.JWT_SECRET || 'test-secret');

    // Create a tag
    const tag = await Tag.create({
      name: 'Array',
      slug: 'array',
    });
    tagId = tag._id.toString();
  });

  describe('GET /api/problems', () => {
    beforeEach(async () => {
      // Create test problems
      await Problem.create([
        {
          title: 'Test Problem 1',
          slug: 'test-problem-1',
          description: 'This is a test problem for integration tests.',
          difficulty: 'Easy',
          tags: [tagId],
          examples: [{ input: 'test', output: 'test' }],
          testCases: [{ input: 'test', expectedOutput: 'test', isHidden: false }],
          createdBy: adminId,
        },
        {
          title: 'Test Problem 2',
          slug: 'test-problem-2',
          description: 'This is another test problem for integration tests.',
          difficulty: 'Medium',
          tags: [tagId],
          examples: [{ input: 'test', output: 'test' }],
          testCases: [{ input: 'test', expectedOutput: 'test', isHidden: false }],
          createdBy: adminId,
        },
      ]);
    });

    it('should return list of problems with authentication', async () => {
      const response = await request(app)
        .get('/api/problems')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.problems).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const response = await request(app).get('/api/problems');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should filter problems by difficulty', async () => {
      const response = await request(app)
        .get('/api/problems?difficulty=Easy')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.problems).toHaveLength(1);
      expect(response.body.data.problems[0].difficulty).toBe('Easy');
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/problems?page=1&limit=1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.problems).toHaveLength(1);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
    });
  });

  describe('POST /api/problems', () => {
    it('should create problem with admin role', async () => {
      const newProblem = {
        title: 'New Test Problem',
        description: 'This is a new test problem created via API.',
        difficulty: 'Hard',
        tags: ['array'],
        examples: [{ input: 'test', output: 'test' }],
        testCases: [{ input: 'test', expectedOutput: 'test', isHidden: false }],
      };

      const response = await request(app)
        .post('/api/problems')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProblem);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(newProblem.title);
    });

    it('should fail to create problem without admin role', async () => {
      const newProblem = {
        title: 'Unauthorized Problem',
        description: 'This should fail.',
        difficulty: 'Easy',
        examples: [{ input: 'test', output: 'test' }],
        testCases: [{ input: 'test', expectedOutput: 'test' }],
      };

      const response = await request(app)
        .post('/api/problems')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProblem);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const invalidProblem = {
        title: 'Test',
        // Missing description and other required fields
      };

      const response = await request(app)
        .post('/api/problems')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidProblem);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
