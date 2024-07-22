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
      res.status.error(new ApiError(500, "internal server error", error));
    }
  }

  static async createEmployee(req, res, next) {
    try {
      const { name, title, phoneNumber } = req.body;
      const localFilePath = req.files?.localFilePath[0]?.path;
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
  static async createRojgariBibaranEmployee(req, res, next) {
    try {
      const { name, title, phoneNumber, address, info } = req.body;
      const localFilePath = req.files?.image[0]?.path;
      if (!name || !title || !phoneNumber || !localFilePath || !address) {
        return res
          .status(400)
          .json(
            new ApiError(400, "All fields are required", [
              "name",
              "title",
              "phoneNumber",
              "address",
              "image",
            ])
          );
      }

      console.log(name, title, phoneNumber, localFilePath);
      const response = await uploadOnCloudinary(
        localFilePath,
        "rojgari",
        "png" || "jpg" || "jpeg"
      );

      if (!response) {
        return res
          .status(500)
          .json(
            new ApiError(
              500,
              "Image upload failed, unable to create rojgari bibaran ",
              []
            )
          );
      }
      const rojgarYuva = await prisma.rojgari.create({
        data: {
          name,
          number: phoneNumber,
          title,
          address,
          info,
          imageUrl: response.secure_url,
        },
      });
      if (!rojgarYuva) {
        return res
          .status(400)
          .json(new ApiError(400, "rojgari bibaran  not saved", []));
      }

      res
        .status(201)
        .json(
          new ApiResponse(
            201,
            rojgarYuva,
            "rojgari bibaran  saved successfully"
          )
        );
    } catch (error) {
      return res
        .status(500)
        .json(new ApiError(500, "Internal server error ", error || []));
    }
  }
  // This is a static method that is used to fetch all the users.
  static async getRojgariBibaran(req, res) {
    try {
      const rojgari = await prisma.rojgari.findMany();
      if (rojgari) {
        return res
          .status(200)
          .json(new ApiResponse(200, rojgari, "Rojgari Bibaran"));
      }
      return res
        .status(404)
        .json(new ApiError(404, "No rojgari bibaran found", []));
    } catch (error) {
      return res
        .status(500)
        .json(new ApiError(500, "Internal server error ", error || []));
    }
  }

  // to fetch all the users.
  static async getEmployees(req, res, next) {
    try {
      const employees = await prisma.employee.findMany();
      if (employees) {
        return res
          .status(200)
          .json(new ApiResponse(200, employees, "Employees"));
      }
      return res.status(404).json(new ApiError(404, "No employee found", []));
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json(new ApiError(500, "Internal server error ", error || []));
    }
  }
}
