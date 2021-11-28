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
        res.status(503).json("Service unavailable");
    } finally {
        if (conn) return conn.end();
    }
  };

  // getting team
const getTeam = async (req: Request, res: Response, next: NextFunction) => {

    let conn: any;
    try {
        let team: [Team] = await db.pool.query("SELECT * FROM teams where id ="+req.params.id);
        if (!team.length) return res.status(404).json('team not found');
        res.status(200).json(team[0]);
    } catch (err) {
        console.log("====================+>",err);
        res.status(503).json("Service unavailable");
    } finally {
        if (conn) return conn.end();
    }
};

// adding a team
const addTeam = async (req: Request, res: Response, next: NextFunction) => {

    let conn: any;
      try {
          let team: [Team] = await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", [req.body.name, req.body.description, new Date, new Date]);
          res.status(201).json(team);
      } catch (err) {
          console.log("====================+>",err);
          res.status(400).json("Bad request");
      } finally {
          if (conn) return conn.end();
      }
  };

// updating a team
const updateTeam = async (req: Request, res: Response, next: NextFunction) => {
    let conn: any;
    try {
        let team: any = await db.pool.query("UPDATE teams set name =?, description =?, updated_at =? WHERE id =?", [req.body.name, req.body.description, new Date, req.params.id]);
        // console.log(team.affectedRows);
        
        if (team.affectedRows != 1) return res.status(404).json('team not found');
        res.status(200).json("Team updated successfully");
    } catch (err) {
        console.log("====================+>",err);
        res.status(503).json("Service unavailable");
    } finally {
        if (conn) return conn.end();
    }
};

// deleting one or many teams
const deleteOneOrMayTeam = async (req: Request, res: Response, next: NextFunction) => {
    
    let conn: any;
      try {
        let listTeamsIds: any = req.query.ids;
        let listTeamsIdsToIterable = listTeamsIds.replace(/['"]+/g, '').split(',');
        listTeamsIdsToIterable.forEach(async (id: number) => {
            await db.pool.query("DELETE FROM teams WHERE id = ?", [id]);
        });
        res.status(200).json("Team(s) deleted");
      } catch (err) {
          console.log("====================+>",err);
          res.status(503).json("Service unavailable");
      } finally {
          if (conn) return conn.end();
      }
  };

export default { getTeams, getTeam, addTeam, updateTeam, deleteOneOrMayTeam };
