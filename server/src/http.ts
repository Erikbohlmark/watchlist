import type { NextFunction, Request, RequestHandler, Response } from "express";

export function handle(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = fn(req, res, next) as unknown;
      if (result instanceof Promise) {
        result.catch(next);
      }
    } catch (err) {
      next(err);
    }
  };
}

export function routeParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}
