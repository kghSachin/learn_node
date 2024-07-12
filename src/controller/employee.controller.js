import prisma from "../../DB/db.config.js";
import ApiResponse from "../utils/api_response.js";
import uploadOnCloudinary from "../utils/cloudinary.config.js";
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
      const { name, title, phoneNumber } = req.body;
      const localFilePath = req.files?.picture[0]?.path;
      if (!name || !title || !phoneNumber || !localFilePath) {
        return res
          .status(400)
          .json(new ApiError(400, "All fields are required", []));
      }
      const response = await uploadOnCloudinary(
        localFilePath,
        "employee",
        "png" || "jpg" || "jpeg"
      );
      if (!response) {
        return res
          .status(500)
          .json(new ApiError(500, "Image upload failed", []));
      }
      const employee = await prisma.employee.create({
        data: {
          name,
          title,
          number: phoneNumber,
          imageUrl: response.secure_url,
        },
      });
      if (!employee) {
        return res
          .status(400)
          .json(new ApiError(400, "Employee not saved", []));
      }

      res
        .status(201)
        .json(
          new ApiResponse(201, { employee }, "Employee saved successfully")
        );
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
}
