import express from "express";
import { EmployeeController } from "../controller/employee.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.get("/health", EmployeeController.getHealth);

router.post("/employee", EmployeeController.createEmployee);
router.route("/create_employee").post(
  upload.fields([
    {
      name: "picture",
      maxCount: 1,
    },
  ]),
  EmployeeController.createEmployee
);
router.get("/get_employee", EmployeeController.getEmployees);
router.get("/get_bibaran", EmployeeController.getRojgariBibaran);
router.post("/phone_number", EmployeeController.collectPhoneNumbers);
router.post(
  "/create-rojgari-bibaran",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  EmployeeController.createRojgariBibaranEmployee
);

export default router;
