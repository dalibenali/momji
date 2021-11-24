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

  // getting team
const getTeam = async (req: Request, res: Response, next: NextFunction) => {

    let conn: any;
    let id: string = req.params.id;
    try {
        let team: Team = await db.pool.query("SELECT * FROM teams where id ="+id);
        res.status(200).json(team);
    } catch (err) {
        console.log("====================+>",err);
    } finally {
        if (conn) return conn.end();
    }
};

export default { getTeams, getTeam };
