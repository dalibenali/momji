process.env.NODE_ENV = 'test';

import chaiHttp from 'chai-http';
import chai from "chai";
import router from '../../src/server';
import db from '../../src/utils/db';
import Team from 'models/Team';

chai.should();
chai.use(chaiHttp);

describe("Teams routes", ()=> {
  const notFoundTeamId = 999;
  const newTeam = {
    name: 'Team5',
    description: 'description5',
  };
  const malFormedTeamId = "1d";

  // clean database test before all tests
  beforeEach(async ()=> {
    await db.pool.query("DELETE FROM teams");
  });

  // get all teams, [GET:200]
  it("Should return an array of teams with 200 status code", async ()=>  {
    await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", ["Team1", "description1", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", ["Team2", "description2", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);

    let res = await chai.request(router).get("/teams").send();
    res.should.have.status(200);
    res.body.should.be.an("array").length(2);
    res.body[0].should.have.property("id");
    res.body[0].should.have.property("name");
    res.body[0].should.have.property("description");
    res.body[0].should.have.property("created_at");
    res.body[0].should.have.property("updated_at");
  });
  
  // get team, [GET:200]
  it("Should return team object with 200 status code, [GET:200]", async ()=>  {
    await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", ["Team3", "description1", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    let team: [Team] = await db.pool.query("SELECT * FROM teams where name ='Team3'");
  
    let res = await chai.request(router).get("/teams/"+team[0].id).send();
    res.should.have.status(200);
    res.body.should.be.an("object");
    res.body.should.have.property("id");
    res.body.should.have.property("name");
    res.body.should.have.property("description");
    res.body.should.have.property("created_at");
    res.body.should.have.property("updated_at");
  });

  // get team, [GET:404]
  it("Should return 404 status code if team not found", async ()=>  {
    let res = await chai.request(router).get("/teams/"+notFoundTeamId).send();
    res.should.have.status(404);
    res.body.should.equal("team not found");
  });
  
  // get team, [GET:400]
  it("Should not return team if mal formed id params and return 400 status code", async ()=>  {
    let res = await chai.request(router).get("/teams/"+malFormedTeamId).send();
    res.should.have.status(400);
    res.body.should.equal("id must be a number");
  });

  // add team, [POST:201]
  it("Should create new team and return 201 status code", async () => {
    let team = {
      "name": "Team4",
	    "description": "taratata"
    };

    let res = await chai.request(router).post("/teams").send(team);
    res.should.have.status(201);
  });

  // add team, [POST:400]
  it("Should return 400 status code if bad body request", async () => {
    let team = {
      "badfield": "Team4",
	    "description": "taratata"
    };

    let res = await chai.request(router).post("/teams").send(team);
    res.should.have.status(400);
    res.body.should.equal("Bad request");
  });

  // update team, [PUT:200]
  it("Should update team and return 200 status code", async () => {
    await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", ["Team4", "description1", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    let team: [Team] = await db.pool.query("SELECT * FROM teams where name ='Team4'");
    let res = await chai
      .request(router)
      .put("/teams/"+team[0].id)
      .send(newTeam);
    res.should.have.status(200);
    res.body.should.equal("Team updated successfully");
  });

  // update team, [PUT:404]
  it("Should not update team if not exist and return 404 status code", async () => {
    let res = await chai
      .request(router)
      .put("/teams/"+notFoundTeamId)
      .send(newTeam);
      res.should.have.status(404);
      res.body.should.equal("team not found");
  });

  // update team, [PUT:400]
  it("Should not update team if id params is not number and return 400 status code", async ()=>  {
    let res = await chai.request(router).put("/teams/"+malFormedTeamId).send(newTeam);
    res.should.have.status(400);
    res.body.should.equal("id must be a number");
  });

  // delete team, [DELETE:204]
  it("Should delete one or many teams by id and return 204 status code", async ()=>  {
    await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", ["TeamA", "description A", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", ["TeamB", "description B", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    
    let teamA: [Team] = await db.pool.query("SELECT * FROM teams where name ='TeamA'");
    let teamB: [Team] = await db.pool.query("SELECT * FROM teams where name ='TeamB'");
    
    let teamsIds: String = '"'+teamA[0].id+','+teamB[0].id+'"';
    let res = await chai.request(router).delete("/teams?ids="+teamsIds).send();
    res.should.have.status(200);
    res.body.should.equal("Team(s) deleted");
  });

});