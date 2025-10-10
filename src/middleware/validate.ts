import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }
  };
};

export { validate };