import { Request, Response, NextFunction } from "express";

// Validate request params
const cors = (req: Request, res: Response, next: NextFunction) =>{
    res.header("Access-Control-Allow-Origin", "*");
    // CORS headers
    res.header(
      "Access-Control-Allow-Headers",
      "origin, X-Requested-With,Content-Type,Accept, Authorization"
    );
    // CORS method headers
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
      return res.status(200).json({});
    }
    next();
};

export = cors;
