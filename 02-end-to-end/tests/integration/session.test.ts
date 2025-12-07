import request from 'supertest';
import { createApp } from '../../server/src/app';

describe('Session API', () => {
  const app = createApp();

  describe('POST /api/sessions', () => {
    it('should create a new session with default values', async () => {
      const response = await request(app)
        .post('/api/sessions')
        .send({});

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('code');
      expect(response.body.data).toHaveProperty('language');
      expect(response.body.data.language).toBe('javascript');
    });

    it('should create a session with custom code and language', async () => {
      const response = await request(app)
        .post('/api/sessions')
        .send({
          code: 'print("Hello, World!")',
          language: 'python',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.code).toBe('print("Hello, World!")');
      expect(response.body.data.language).toBe('python');
    });
  });

  describe('GET /api/sessions/:id', () => {
    it('should retrieve an existing session', async () => {
      // First, create a session
      const createResponse = await request(app)
        .post('/api/sessions')
        .send({
          code: 'console.log("test");',
          language: 'javascript',
        });

      const sessionId = createResponse.body.data.id;

      // Then, retrieve it
      const getResponse = await request(app)
        .get(`/api/sessions/${sessionId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.success).toBe(true);
      expect(getResponse.body.data.id).toBe(sessionId);
      expect(getResponse.body.data.code).toBe('console.log("test");');
    });

    it('should return 404 for non-existent session', async () => {
      const response = await request(app)
        .get('/api/sessions/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Session not found');
    });
  });

  describe('GET /health', () => {
    it('should return server health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
