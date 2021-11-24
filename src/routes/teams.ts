import express, { Router } from "express";
import controller from "../controllers/teams";
const router: Router = express.Router();

router.get("/teams", controller.getTeams);

export = router;
