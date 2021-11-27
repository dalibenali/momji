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
        let team: [Team] = await db.pool.query("SELECT * FROM teams where id ="+id);
        if (!team.length) return res.status(404).json('team not found');
        res.status(200).json(team[0]);
    } catch (err) {
        console.log("====================+>",err);
    } finally {
        if (conn) return conn.end();
    }
};

// adding a team
const addTeam = async (req: Request, res: Response, next: NextFunction) => {

    let conn: any;
      try {
          let name: String = req.body.name;
          let description: String = req.body.description;
          let created_at: Date = new Date;
          let updated_at: Date = new Date;
          let team: [Team] = await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", [name, description, created_at, updated_at]);
          
          res.status(201).json(team);
      } catch (err) {
          console.log("====================+>",err);
      } finally {
          if (conn) return conn.end();
      }
  };

// updating a team
const updateTeam = async (req: Request, res: Response, next: NextFunction) => {
    
    let id: string = req.params.id;
    let conn: any;
      try {
          let name: String = req.body.name;
          let description: String = req.body.description;
          let updated_at: Date = new Date;
          let team: [Team] = await db.pool.query("UPDATE teams set name =?, description =?, updated_at =? WHERE id =?", [name, description, updated_at, id]);
          
          res.status(200).json(team);
      } catch (err) {
          console.log("====================+>",err);
          // throw err;
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
        listTeamsIdsToIterable.forEach((id: any) => {
            db.pool.query("DELETE FROM teams WHERE id = ?", [id]);
        });
        res.status(204).send();
      } catch (err) {
          console.log("====================+>",err);
      } finally {
          if (conn) return conn.end();
      }
  };

export default { getTeams, getTeam, addTeam, updateTeam, deleteOneOrMayTeam };
