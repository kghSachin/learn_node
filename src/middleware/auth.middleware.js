import jwt from "jsonwebtoken";
import { ApiError } from "../utils/error_response.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Internal server error",
          error.message || "invalid access token"
        )
      );
  }
};
