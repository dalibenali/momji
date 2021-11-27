process.env.NODE_ENV = 'test'; // set test env to use test database

import chaiHttp from 'chai-http';
import router from '../../src/server';
import db from '../../src/utils/db';
import chai from "chai";
import Team from 'models/Team';

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
  });

  it("Should return an array of employees with 200 status code", async ()=>  {
    await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", ["Team1", "description1", "2019-03-10 02:55:05", "2019-06-10 00:55:05"])
    await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", ["Team2", "description1", "2019-03-10 02:55:05", "2019-06-10 00:55:05"])
    let team1: [Team] = await db.pool.query("SELECT * FROM teams where name ='Team1'");
    let team2: [Team] = await db.pool.query("SELECT * FROM teams where name ='Team2'");
    
    await db.pool.query
    ("INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", ["Alex" , "legrand", "legrand@yahoo.com", "2300 Witmer Rd, Niagara Falls, NY 14305, États-Unis", "2018-04-17 04:59:45", false, team1[0].id, "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    
    await db.pool.query
    ("INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", ["Alex" , "legrand", "legrand@yahoo.com", "2300 Witmer Rd, Niagara Falls, NY 14305, États-Unis", "2018-04-17 04:59:45", false, team1[0].id, "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    
    await db.pool.query
    ("INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", ["Alex" , "legrand", "legrand@yahoo.com", "2300 Witmer Rd, Niagara Falls, NY 14305, États-Unis", "2018-04-17 04:59:45", false, team2[0].id, "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    
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

});