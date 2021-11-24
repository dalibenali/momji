import { Request, Response, NextFunction } from "express";

// Cors
const cors = (req: Request, res: Response, next: NextFunction) =>{
    res.header("Access-Control-Allow-Origin", "*");
    // Cors headers
    res.header(
      "Access-Control-Allow-Headers",
      "origin, X-Requested-With,Content-Type,Accept, Authorization"
    );
    // Cors method headers
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
      return res.status(200).json({});
    }
    next();
};

export = cors;
