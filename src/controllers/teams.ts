import { Request, Response, NextFunction } from "express";
import Team from "../models/Team";
import db from '../utils/db';

// getting all teams
const getTeams = async (req: Request, res: Response, next: NextFunction) => {
    let conn: any;
    try {
        let teams: [Team] = await db.pool.query("SELECT * FROM teams");
        res.status(200).json(teams);
    } catch (err) {
        console.log("====================+>",err);
    } finally {
        if (conn) return conn.end();
    }
  };

export default { getTeams };
