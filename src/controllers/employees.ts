import { Request, Response, NextFunction } from "express";
import db from "../utils/db";
import employeeProcess from "../services/employees.ts/employeeProcess";
import Team from "../models/Team";
import Employee from "../models/Employee";

// getting all employees
const getEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let conn: any;
  let processedEmployeesArray: any[] = [];
  try {
    let employees: [Employee] = await db.pool.query("SELECT * FROM employees");
    for (let employee of employees) {
      let processEmployee = await employeeProcess(employee); // call employeeProcess service
      processedEmployeesArray.push(processEmployee);
    }
    res.status(200).json(processedEmployeesArray);
  } catch (err) {
    console.log("====================>", err);
  } finally {
    if (conn) return conn.end();
  }
};
// getting employee
const getEmployee = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any;
  try {
    let employee: [Employee] = await db.pool.query(
      "SELECT * FROM employees where id =" + req.params.id
    );
    if (!employee.length) return res.status(404).json("employee not found");
    let processedEmployee = await employeeProcess(employee[0]);
    res.status(200).json(processedEmployee);
  } catch (err) {
    console.log("====================+>", err);
  } finally {
    if (conn) return conn.end();
  }
};

// deleting employee
const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let conn: any;
  try {
    await db.pool.query("DELETE FROM employees WHERE id = ?", [req.params.id]);
    res.status(200).json("Employee deleted");
  } catch (err) {
    console.log("====================+>", err);
  } finally {
    if (conn) return conn.end();
  }
};

// adding employee
const addEmployee = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any;
  try {
    await db.pool.query(
      "INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.address,
        new Date(),
        false,
        req.body.team_id,
        new Date(),
        new Date(),
      ]
    );
    res.status(201).json("Employee created successfully");
  } catch (err) {
    console.log("====================+>", err);
    res.status(400).json("Bad request");
  } finally {
    if (conn) return conn.end();
  }
};

// update employee
const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let conn: any;
  try {
    // check if the employee exists
    let employee: [Employee] = await db.pool.query(
      "SELECT * FROM employees where id =" + req.params.id
    );
    if (!employee.length) return res.status(404).json("employee not found");

    // check if the team_id belongs to an existing team
    let team: [Team] = await db.pool.query(
      "SELECT * FROM teams where id =" + req.body.team_id
    );
    if (!team.length) return res.status(404).json("team not found");

    // update our employee
    await db.pool.query(
      "UPDATE employees set firstName =?, lastName =?, email =?, address =?, team_id =?, updated_at =? WHERE id =?",
      [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.address,
        req.body.team_id,
        new Date(),
        employee[0].id,
      ]
    );
    res.status(200).json("Employee updated successfully");
  } catch (err) {
    console.log("====================+>", err);
    res.status(400).json("Bad request");
  } finally {
    if (conn) return conn.end();
  }
};

export default {
  getEmployees,
  getEmployee,
  deleteEmployee,
  addEmployee,
  updateEmployee,
};
