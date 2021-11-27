import express, { Router } from "express";
import controller from "../controllers/employees";

let router: Router = express.Router();
router.get("/employees", controller.getEmployees);

export = router;
