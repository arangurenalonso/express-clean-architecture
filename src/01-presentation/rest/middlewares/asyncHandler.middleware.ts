import Result from '@domain/abstract/result/result';
import ResultT from '@domain/abstract/result/resultT';
import { Request, Response, NextFunction } from 'express';

const asyncHandlerMiddleware = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Result | ResultT<any> | any>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await fn(req, res, next);
      if (result instanceof ResultT) {
        if (result.isSuccess) {
          res.status(200).json(result.value);
        } else {
          res
            .status(result.error.statusCode)
            .json({ type: result.error.type, error: result.error.message });
        }
      } else if (result instanceof Result) {
        if (result.isSuccess) {
          res.status(200).json({ message: 'Operation successful' });
        } else {
          res
            .status(result.error.statusCode)
            .json({ type: result.error.type, error: result.error.message });
        }
      } else {
        res.json(result);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `${error}`;
      const errorStack = error instanceof Error ? error.stack : '';
      res.status(500).json({
        type: 'Internal Server Error',
        error: `Unexpected error: ${errorMessage}`,
        stack: errorStack,
      });
    }
  };
};

export default asyncHandlerMiddleware;
