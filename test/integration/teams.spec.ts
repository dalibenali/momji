process.env.NODE_ENV = 'test';

import chaiHttp from 'chai-http';
import router from '../../src/server';
import db from '../../src/utils/db';
import chai from "chai";
import Team from 'models/Team';

chai.should();
chai.use(chaiHttp);

describe("Teams routes", ()=> {

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

  it("Should create new team and return 201 status code", async () => {
    let team = {
      "name": "Team4",
	    "description": "taratata"
    };

    let result = await chai.request(router).post("/teams").send(team);
    result.should.have.status(201);
  });
});