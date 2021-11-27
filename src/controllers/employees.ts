import { Request, Response, NextFunction } from "express";
import Employee from "../models/Employee";
import db from '../utils/db';
import employeeProcess from "../utils/services/employees.ts/employeeProcess";

// getting all employees
const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
    let conn: any;
    let processedEmployeesArray : any[] = [];
    let processEmployee;
    try {
        let employees: [Employee] = await db.pool.query("SELECT * FROM employees");
        for (let employee of employees) { 
            processEmployee = await employeeProcess(employee); // call 
            processedEmployeesArray.push(processEmployee);
        };
        res.status(200).json(processedEmployeesArray);
        
    } catch (err) {
        console.log("====================>",err);
    } finally {
        if (conn) return conn.end();
    }
  };


export default { getEmployees };
