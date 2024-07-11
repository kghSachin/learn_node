import prisma from "../DB/db.config.js";
import ApiResponse from "../utils/api_response.js";
import { ApiError } from "../utils/error_response.js";
export class EmployeeController {
  static async getHealth(req, res, next) {
    try {
      res.status(200).json({ message: "Server is running" });
    } catch (error) {
      next(error);
    }
  }
  static async collectPhoneNumbers(req, res, next) {
    try {
      const { phoneNumber } = req.body;
      if (phoneNumber.length === 10) {
        console.log(phoneNumber);
        const number = await prisma.phoneNumber.create({
          data: {
            number: phoneNumber,
          },
        });
        if (!number) {
          return res
            .status(400)
            .json(new ApiError(400, "Phone number not saved", []));
        }
        return res
          .status(201)
          .json(
            new ApiResponse(
              201,
              { phoneNumber },
              "Phone number saved successfully"
            )
          );
      } else {
        return res
          .status(400)
          .json(new ApiError(400, "Phone number must be 10 characters", []));
      }
    } catch (error) {
      next(error);
    }
  }

  static async createEmployee(req, res, next) {
    try {
      res.status(201).json({ message: "Employee created successfully" });
    } catch (error) {
      next(error);
    }
  }
  static async getEmployees(req, res, next) {
    try {
      res.status(200).json({ message: "Employees fetched successfully" });
    } catch (error) {
      next(error);
    }
  }
  static async getEmployee(req, res, next) {
    try {
      res.status(200).json({ message: "Employee fetched successfully" });
    } catch (error) {
      next(error);
    }
  }
  static async updateEmployee(req, res, next) {
    try {
      res.status(200).json({ message: "Employee updated successfully" });
    } catch (error) {
      next(error);
    }
  }
  static async deleteEmployee(req, res, next) {
    try {
      res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
