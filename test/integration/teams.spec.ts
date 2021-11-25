process.env.NODE_ENV = 'test';

import chaiHttp from 'chai-http';
import router from '../../src/server';
import db from '../../src/utils/db';
import chai from "chai";
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
  // clean database test after all tests
  afterEach(async ()=> {
    await db.pool.query("DELETE FROM teams");
  });

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

  it("Should return an array with one teams object and 200 status code", async ()=>  {
    await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", ["Team3", "description1", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    let team: [Team] = await db.pool.query("SELECT * FROM teams where name ='Team3'");
  
    let res = await chai.request(router).get("/teams/"+team[0].id).send();
    res.should.have.status(200);
    res.body.should.be.an("array").length(1);
    res.body[0].should.have.property("id");
    res.body[0].should.have.property("name");
    res.body[0].should.have.property("description");
    res.body[0].should.have.property("created_at");
    res.body[0].should.have.property("updated_at");
  });

  it("Should return empty array with 200 status code if team not found", async ()=>  {
    let res = await chai.request(router).get("/teams/"+notFoundTeamId).send();
    res.should.have.status(200);
    res.body.should.be.an("array").length(0);
  });
  
  it("Should not return team if mal formed id params and return 400 status code", async ()=>  {
    let res = await chai.request(router).get("/teams/"+malFormedTeamId).send();
    res.should.have.status(400);
    res.body.message.should.equal("id must be a number");
  });

  it("Should create new team and return 201 status code", async () => {
    let team = {
      "name": "Team4",
	    "description": "taratata"
    };

    let result = await chai.request(router).post("/teams").send(team);
    result.should.have.status(201);
  });

  it("Should update team and return 200 status code", async () => {
    await db.pool.query("INSERT INTO teams (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)", ["Team4", "description1", "2019-03-10 02:55:05", "2019-06-10 00:55:05"]);
    let team: [Team] = await db.pool.query("SELECT * FROM teams where name ='Team4'");
    let result = await chai
      .request(router)
      .put("/teams/"+team[0].id)
      .send(newTeam);
    result.should.have.status(200);
  });

  it.only("Should not update team if not exist and return 200 status code", async () => {
    let result = await chai
      .request(router)
      .put("/teams/"+notFoundTeamId)
      .send(newTeam);
    result.should.have.status(200);
    result.body.affectedRows.should.equal(0);
  });

  it("Should not update team if mal formed id params and return 400 status code", async ()=>  {
    let res = await chai.request(router).put("/teams/"+malFormedTeamId).send(newTeam);
    res.should.have.status(400);
    res.body.message.should.equal("id must be a number");
  });
});