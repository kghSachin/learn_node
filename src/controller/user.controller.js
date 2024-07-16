import prisma from "../../DB/db.config.js";
import ApiResponse from "../utils/api_response.js";
import { ApiError } from "../utils/error_response.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

export class AuthController {
  static async register(req, res) {
    try {
      let { email, password, role } = req.body;

      console.log(email, password);

      if (!email || !password) {
        return res
          .status(400)
          .json(new ApiError(400, "Email and password are required"));
      }
      const userExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (userExists) {
        return res.status(400).json(new ApiError(400, "User already exists"));
      }
      const salt = bcrypt.genSaltSync(10);

      password = bcrypt.hashSync(password, salt);

      const user = await prisma.user.create({
        data: {
          email,
          password,
          role,
        },
      });

      if (user) {
        return res.status(201).json(new ApiResponse(201, user, "User created"));
      }
      return res
        .status(400)
        .json(new ApiError(400, "unable to create the user"));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(new ApiError(500, "Internal server error", error));
    }
  }
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json(new ApiError(400, "Email and password are required"));
      }
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        return res.status(400).json(new ApiError(400, "User not found"));
      }
      console.log("working>>>");
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(400).json(new ApiError(400, "Invalid credentials"));
      }
      const token = generateAccessToken({
        id: user.id,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, { user, token }, "User logged in"));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(new ApiError(500, "Internal server error", error));
    }
  }
}
