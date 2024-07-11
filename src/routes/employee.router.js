import express from "express";
import { EmployeeController } from "../controller/employee.controller.js";

const router = express.Router();

router.get("/health", EmployeeController.getHealth);
router.get("/employees", EmployeeController.getEmployees);
router.get("/employee/:id", EmployeeController.getEmployee);
router.post("/employee", EmployeeController.createEmployee);
router.put("/employee/:id", EmployeeController.updateEmployee);
router.delete("/employee/:id", EmployeeController.deleteEmployee);
router.post("/phone_number", EmployeeController.collectPhoneNumbers);

export default router;
