import { NextFunction, Request, Response } from "express";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof Error) {
    return res.status(500).send({
      message: err.message,
    });
  }

  return res.status(500).send({
    message: 'Internal server error',
  });
}

export default errorHandler;