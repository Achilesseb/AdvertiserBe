export const catchAsync =
  (fn: Function) =>
  (req: Express.Request, res: Express.Response, next: Function) => {
    fn(req, res, next).catch(next);
  };
