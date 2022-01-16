import { NextFunction, Request, Response } from "express";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.log(`${new Date()} - ${req.originalUrl}`);
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof Error) {
    console.log(err.stack);
    return res.status(500).send({
      error: {
        name: err.name,
        message: err.message,
      }
    });
  }

  return res.status(500).send({
    error: {
      message: 'Internal server error',
    }
  });
}

export default errorHandler;