import { Request, Response } from 'express';

// Health Check Controller
export const healthCheck = (req: Request, res: Response) => {
  try {
    // If needed, add additional checks, such as DB connection
    res.status(200).json({ status: 'OK', message: 'Service is healthy' });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ status: 'FAIL', message: 'Service is unavailable' });
  }
};
