import { Request, Response, NextFunction } from "express";

// Validate request params
const idValidation = (req: Request, res: Response, next: NextFunction) => {
  const isNumber = new RegExp(/^\d+$/);
  if (!isNumber.test(req.params.id))
    return res.status(400).json("id must be a number");
  next();
};

export default { idValidation };
