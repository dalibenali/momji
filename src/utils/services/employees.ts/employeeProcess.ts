import Team from "models/Team";
import Employee from "models/Employee";
import db from "../../db";
// processing of an employee to have a model corresponding to the http 
// response cited in the specifications
let processEmployee = async (employee: Employee): Promise<Array<Employee> | string> =>{
    try {
        let team: [Team] = await db.pool.query("SELECT id, name, description, created_at, updated_at FROM teams where id =?", [employee.team_id]);
        let newEmployee: any = {};
        newEmployee.id = employee.id
        newEmployee.profile = {};
        newEmployee.profile.firstName = employee.firstName;
        newEmployee.profile.lastName = employee.firstName;
        newEmployee.email = employee.email;
        newEmployee.address = employee.address;
        newEmployee.registered = employee.registered;
        newEmployee.isActive = employee.isActive;
        newEmployee.team = {};
        newEmployee.team.id = team[0].id;
        newEmployee.team.name = team[0].name;
        newEmployee.team.description = team[0].description;
        newEmployee.team.created_at = team[0].created_at;
        newEmployee.team.updated_at = team[0].updated_at;
        newEmployee.created_at = employee.isActive;
        newEmployee.updated_at = employee.updated_at;
        return newEmployee;
    } catch (error: any) {
        return error.message;
    }

};

export = processEmployee;