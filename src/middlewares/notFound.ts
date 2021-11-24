import { Request, Response, NextFunction } from "express";

// Handle 404 not found
const notFound = (req: Request, res: Response, next: NextFunction) =>{
    const error: Error = new Error("not found");
    return res.status(404).json({
      message: error.message,
    });

};

export = notFound;