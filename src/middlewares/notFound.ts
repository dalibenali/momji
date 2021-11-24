import { Request, Response, NextFunction } from "express";

// Validate request params
const notFound = (req: Request, res: Response, next: NextFunction) =>{
    const error: Error = new Error("not found");
    return res.status(404).json({
      message: error.message,
    });

};

export = notFound;