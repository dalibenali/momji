process.env.NODE_ENV = 'test'; // set test env to use test database

import chaiHttp from 'chai-http';
import router from '../../src/server';
import db from '../../src/utils/db';
import chai from "chai";
import Team from 'models/Team';
import Employee from 'models/Employee';

chai.should();
chai.use(chaiHttp);

describe("Employees routes", ()=> {
  const notFoundTeamId = 999;
  const newTeam = {
    name: 'Team5',
    description: 'description5',
  };
  const malFormedTeamId: string = "1d";
  // clean database test after all tests
  beforeEach(async ()=> {
    await db.pool.query("DELETE FROM employees");
    await db.pool.query("DELETE FROM teams");
  });

  it("Should return an array of employees with 200 status code", async ()=>  {
    // create 2 teams
    await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", ["Team1", "description1", "2019-03-10 02:55:05", "2019-06-10 00:55:05"])
    await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", ["Team2", "description1", "2019-03-10 02:55:05", "2019-06-10 00:55:05"])
    // get our 2 teams
    let team1: [Team] = await db.pool.query("SELECT * FROM teams where name ='Team1'");
    let team2: [Team] = await db.pool.query("SELECT * FROM teams where name ='Team2'");
    
    // create three employees and assign them to our teams
    await db.pool.query
    ("INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", ["Alex" , "legrand", "legrand@yahoo.com", "2300 Witmer Rd, Niagara Falls, NY 14305, États-Unis", "2018-04-17 04:59:45", false, team1[0].id, "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    await db.pool.query
    ("INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", ["Alex" , "legrand", "legrand@yahoo.com", "2300 Witmer Rd, Niagara Falls, NY 14305, États-Unis", "2018-04-17 04:59:45", false, team1[0].id, "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    await db.pool.query
    ("INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", ["Alex" , "legrand", "legrand@yahoo.com", "2300 Witmer Rd, Niagara Falls, NY 14305, États-Unis", "2018-04-17 04:59:45", false, team2[0].id, "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    
    // call employee endpoint with get method
    let res = await chai.request(router).get("/employees").send();
    res.should.have.status(200);
    res.body.should.be.an("array").length(3);
    res.body[0].should.have.property("id");
    res.body[0].profile.should.have.property("firstName");
    res.body[0].profile.should.have.property("lastName");
    res.body[0].should.have.property("email");
    res.body[0].should.have.property("address");
    res.body[0].should.have.property("registered");
    res.body[0].should.have.property("isActive");
    res.body[0].team.should.have.property("id");
    res.body[0].team.should.have.property("name");
    res.body[0].team.should.have.property("description");
    res.body[0].team.should.have.property("created_at");
    res.body[0].team.should.have.property("updated_at");
    res.body[0].should.have.property("created_at");
    res.body[0].should.have.property("updated_at");
  });

  it("Should return employee object and 200 status code", async ()=>  {
    // create our team 
    await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", ["TeamShape", "description1", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    // get our team
    let team: [Team] = await db.pool.query("SELECT * FROM teams where name ='TeamShape'");

    // create an employee and assign it to our team
    await db.pool.query("INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", ["Alfred", "mackbill", "alimackbill@yahoo.com", "14 avenue bob leponge, Mars", "2019-03-10 02:55:05", false, team[0].id,  "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    // get our employee
    let employee: [Employee] = await db.pool.query("SELECT * FROM employees where firstName ='Alfred'");

    // call employee endpoint with get method
    let res = await chai.request(router).get("/employees/"+employee[0].id).send();
    res.should.have.status(200);
    res.body.should.be.an("object");
    res.body.should.have.property("id");
    res.body.id.should.equal(employee[0].id);
  });

  it("Should delete employee and return 204 status code", async ()=>  {
    // create new team
    await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", ["TeamPP", "description A", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    let team: [Team] = await db.pool.query("SELECT * FROM teams where name ='TeamPP'");
    
    // create new employee
    await db.pool.query("INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", ["Alex" , "legrand", "legrand@yahoo.com", "2300 Witmer Rd, Niagara Falls, NY 14305, États-Unis", "2018-04-17 04:59:45", false, team[0].id, "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    let employee: [Employee] = await db.pool.query("SELECT id FROM employees where email = 'legrand@yahoo.com'");
    
    // call employees endpoint with delete method
    let res = await chai.request(router).delete("/employees/"+employee[0].id).send();
    res.should.have.status(204);
  });

  it("Should create employee and return 201 status code", async () => {
    // create new team
    await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", ["TeamZZ", "description A", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    // get our team
    let team: [Team] = await db.pool.query("SELECT id FROM teams where name ='TeamZZ'");
    // our employee to send in post request
    let employee = {
      "firstName": "feres",
      "lastName": "bikl",
      "email": "boucer@yahoo.com",
      "address": "1200 Witmer Rd, Niagara Falls, NY 14305, États-Unis",
      "team_id": team[0].id // assign our employee to our team
    }

    // call employee endpoint with post method
    let result = await chai.request(router).post("/employees").send(employee);
    result.should.have.status(201);
    result.body.should.equal("Employee created successfully");
  });

});