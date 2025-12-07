import { Router, Request, Response } from 'express';
import sessionService from '../services/sessionService';

const router = Router();

// Create a new session
router.post('/', (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;
    const session = sessionService.createSession({ code, language });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create session',
    });
  }
});

// Get session by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = sessionService.getSession(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get session',
    });
  }
});

// Get server stats (for debugging)
router.get('/stats/all', (req: Request, res: Response) => {
  try {
    const stats = sessionService.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get stats',
    });
  }
});

export default router;
