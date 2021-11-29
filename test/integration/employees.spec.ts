process.env.NODE_ENV = "test"; // set test env to use test database

import chaiHttp from "chai-http";
import router from "../../src/server";
import db from "../../src/utils/db";
import chai from "chai";
import Team from "models/Team";
import Employee from "models/Employee";

chai.should();
chai.use(chaiHttp);

describe("Employees routes", () => {
  const notFoundTeamId = 999;
  const newTeam = {
    name: "Team5",
    description: "description5",
  };

  // clean database test after all tests
  beforeEach(async () => {
    await db.pool.query("DELETE FROM employees");
    await db.pool.query("DELETE FROM teams");
  });

  // get all employees, [GET:200]
  it("Should return an array of employees with 200 status code", async () => {
    // create 2 teams
    await db.pool.query(
      "INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)",
      ["Team1", "description1", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]
    );
    await db.pool.query(
      "INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)",
      ["Team2", "description1", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]
    );
    // get our 2 teams
    let team1: [Team] = await db.pool.query(
      "SELECT * FROM teams where name ='Team1'"
    );
    let team2: [Team] = await db.pool.query(
      "SELECT * FROM teams where name ='Team2'"
    );

    // create three employees and assign them to our teams
    await db.pool.query(
      "INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "Alex",
        "legrand",
        "legrand@yahoo.com",
        "2300 Witmer Rd, Niagara Falls, NY 14305, États-Unis",
        "2018-04-17 04:59:45",
        false,
        team1[0].id,
        "2019-03-10 02:55:05",
        "2019-06-10 00:55:05",
      ]
    );
    await db.pool.query(
      "INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "Alex",
        "legrand",
        "legrand@yahoo.com",
        "2300 Witmer Rd, Niagara Falls, NY 14305, États-Unis",
        "2018-04-17 04:59:45",
        false,
        team1[0].id,
        "2019-03-10 02:55:05",
        "2019-06-10 00:55:05",
      ]
    );
    await db.pool.query(
      "INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "Alex",
        "legrand",
        "legrand@yahoo.com",
        "2300 Witmer Rd, Niagara Falls, NY 14305, États-Unis",
        "2018-04-17 04:59:45",
        false,
        team2[0].id,
        "2019-03-10 02:55:05",
        "2019-06-10 00:55:05",
      ]
    );

    // call employees endpoint with get method
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

  // get employee, [GET:200]
  it("Should return employee by id and 200 status code", async () => {
    // create our team
    await db.pool.query(
      "INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)",
      [
        "TeamShape",
        "description1",
        "2019-03-10 02:55:05",
        "2019-06-10 00:55:05",
      ]
    );
    // get our team
    let team: [Team] = await db.pool.query(
      "SELECT * FROM teams where name ='TeamShape'"
    );

    // create an employee and assign it to our team
    await db.pool.query(
      "INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "Alfred",
        "mackbill",
        "alimackbill@yahoo.com",
        "14 avenue bob leponge, Mars",
        "2019-03-10 02:55:05",
        false,
        team[0].id,
        "2019-03-10 02:55:05",
        "2019-06-10 00:55:05",
      ]
    );
    // get our employee
    let employee: [Employee] = await db.pool.query(
      "SELECT * FROM employees where firstName ='Alfred'"
    );

    // call employees endpoint with get method
    let res = await chai
      .request(router)
      .get("/employees/" + employee[0].id)
      .send();
    res.should.have.status(200);
    res.body.should.be.an("object");
    res.body.should.have.property("id");
    res.body.id.should.equal(employee[0].id);
  });

  // get employee, [GET:400]
  it("Should not return employee if mal formed id params and return 400 status code", async () => {
    let res = await chai.request(router).get("/employees/5g").send();
    res.should.have.status(400);
    res.body.should.equal("id must be a number");
  });

  // get employee, [GET:404]
  it("Should return 404 status code if employee not found", async () => {
    // create new team
    await db.pool.query(
      "INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)",
      ["TeamLL", "description A", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]
    );
    let team: [Team] = await db.pool.query(
      "SELECT * FROM teams where name ='TeamLL'"
    );

    // create our employee assign them to team
    await db.pool.query(
      "INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "Alex",
        "legrand",
        "legrand@yahoo.com",
        "2300 Witmer Rd, Niagara Falls, NY 14305, États-Unis",
        "2018-04-17 04:59:45",
        false,
        team[0].id,
        "2019-03-10 02:55:05",
        "2019-06-10 00:55:05",
      ]
    );
    let employee: [Employee] = await db.pool.query(
      "SELECT id FROM employees where email = 'legrand@yahoo.com'"
    );

    // an object for creating not found employee id
    let d = { a: Number(employee[0].id), b: Number(1) };
    let notFoundEmployeeId = d.a + d.b;

    // call employees endpoint with get method
    let res = await chai
      .request(router)
      .get("/employees/" + notFoundEmployeeId)
      .send();
    res.should.have.status(404);
    res.body.should.equal("employee not found");
  });

  // delete employee, [DELETE:204]
  it("Should delete employee and return 204 status code", async () => {
    // create new team
    await db.pool.query(
      "INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)",
      ["TeamPP", "description A", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]
    );
    let team: [Team] = await db.pool.query(
      "SELECT * FROM teams where name ='TeamPP'"
    );

    // create new employee
    await db.pool.query(
      "INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "Alex",
        "legrand",
        "legrand@yahoo.com",
        "2300 Witmer Rd, Niagara Falls, NY 14305, États-Unis",
        "2018-04-17 04:59:45",
        false,
        team[0].id,
        "2019-03-10 02:55:05",
        "2019-06-10 00:55:05",
      ]
    );
    let employee: [Employee] = await db.pool.query(
      "SELECT id FROM employees where email = 'legrand@yahoo.com'"
    );

    // call employees endpoint with delete method
    let res = await chai
      .request(router)
      .delete("/employees/" + employee[0].id)
      .send();
    res.should.have.status(200);
    res.body.should.equal("Employee deleted");
  });

  // add employee, [POST:201]
  it("Should create employee and return 201 status code", async () => {
    // create new team
    await db.pool.query(
      "INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)",
      ["TeamZZ", "description A", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]
    );
    // get our team
    let team: [Team] = await db.pool.query(
      "SELECT id FROM teams where name ='TeamZZ'"
    );
    // our employee to send in post request
    let employee = {
      firstName: "feres",
      lastName: "bikl",
      email: "boucer@yahoo.com",
      address: "1200 Witmer Rd, Niagara Falls, NY 14305, États-Unis",
      team_id: team[0].id, // assign our employee to our team
    };

    // call employees endpoint with post method
    let res = await chai.request(router).post("/employees").send(employee);
    res.should.have.status(201);
    res.body.should.equal("Employee created successfully");
  });

  // add employee, [POST:400]
  it("Should return 400 status code if bad body request", async () => {
    let badFormedEmployee = {
      badfield: "Ali",
      lastName: "Ali",
      email: "boucer@yahoo.com",
      address: "1200 Witmer Rd, Niagara Falls, NY 14305, États-Unis",
      registered: "2018-04-17T03:59:45.000Z",
      isActive: 0,
      team_id: 32,
    };

    // call employees endpoint with post method
    let res = await chai.request(router).post("/teams").send(badFormedEmployee);
    res.should.have.status(400);
    res.body.should.equal("Bad request");
  });

  // update employee, [PUT:200]
  it("Should update employee and return 200 status code", async () => {
    // create team1 and team2
    await db.pool.query(
      "INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)",
      ["Team1", "description1", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]
    );
    await db.pool.query(
      "INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)",
      ["Team2", "description1", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]
    );

    // get team1 and team2
    let recalledTeam1: [Team] = await db.pool.query(
      "SELECT id FROM teams where name ='Team1'"
    );
    let recalledTeam2: [Team] = await db.pool.query(
      "SELECT id FROM teams where name ='Team2'"
    );

    // create our employee assign them to team1
    await db.pool.query(
      "INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "Alex",
        "legrand",
        "legrand@yahoo.com",
        "2300 Witmer Rd, Niagara Falls, NY 14305, États-Unis",
        "2018-04-17 04:59:45",
        false,
        recalledTeam1[0].id,
        "2019-03-10 02:55:05",
        "2019-06-10 00:55:05",
      ]
    );

    // new employee to send
    let newEmployee = {
      firstName: "dali",
      lastName: "ben ali",
      email: "aloulou@yahoo.com",
      address: "oijhoiuoiuoiuoiu",
      team_id: recalledTeam2[0].id,
    };

    // get employee id
    let employee: [Employee] = await db.pool.query(
      "SELECT id FROM employees where team_id =" + recalledTeam1[0].id
    );

    // call employees endpoint with put method
    let res = await chai
      .request(router)
      .put("/employees/" + employee[0].id)
      .send(newEmployee);
    res.should.have.status(200);
    res.body.should.equal("Employee updated successfully");
  });

  // update employee, [PUT:404]
  it("Should not update employee if not exist and return 404 status code", async () => {
    let newEmployee = {
      firstName: "dali",
      lastName: "ben ali",
      email: "aloulou@yahoo.com",
      address: "oijhoiuoiuoiuoiu",
      team_id: 22,
    };

    // create new team
    await db.pool.query(
      "INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)",
      ["TeamLL", "description A", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]
    );
    let team: [Team] = await db.pool.query(
      "SELECT * FROM teams where name ='TeamLL'"
    );

    // create our employee assign them to team
    await db.pool.query(
      "INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "Alex",
        "legrand",
        "legrand@yahoo.com",
        "2300 Witmer Rd, Niagara Falls, NY 14305, États-Unis",
        "2018-04-17 04:59:45",
        false,
        team[0].id,
        "2019-03-10 02:55:05",
        "2019-06-10 00:55:05",
      ]
    );
    let employee: [Employee] = await db.pool.query(
      "SELECT id FROM employees where email = 'legrand@yahoo.com'"
    );

    // an object for creating not found employee id
    let d = { a: Number(employee[0].id), b: Number(1) };
    let notFoundEmployeeId = d.a + d.b;

    // call employee endpoint with put method
    let res = await chai
      .request(router)
      .put("/employees/" + notFoundEmployeeId)
      .send(newEmployee);
    res.should.have.status(404);
    res.body.should.equal("employee not found");
  });
});
