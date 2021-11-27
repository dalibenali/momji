import express, { Router } from "express";
import reqParamsValidation from "../middlewares/reqParamsValidation";
import controller from "../controllers/employees";

let router: Router = express.Router();
router.get("/employees", controller.getEmployees);
router.get("/employees/:id", reqParamsValidation, controller.getEmployee);

export = router;
