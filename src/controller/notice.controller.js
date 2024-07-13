import prisma from "../../DB/db.config.js";
import ApiResponse from "../utils/api_response.js";
import uploadOnCloudinary from "../utils/cloudinary.config.js";
import { ApiError } from "../utils/error_response.js";

export class NoticeController {
  static async createNotice(req, res) {
    try {
      const { title, body } = req.body;
      console.log(req.files);

      const localFilePath = req.files?.noticeFiles[0]?.path;
      if (!title) {
        return res
          .status(400)
          .json(new ApiError(400, "Notice title is required"));
      }
      const response = await uploadOnCloudinary(
        localFilePath,
        "notice",
        "pdf" || "jpeg" || "png" || "jpg"
      );
      if (!response) {
        return res
          .status(400)
          .json(new ApiError(400, "unable to upload files"));
      }
      const notice = await prisma.notice.create({
        data: {
          title,
          fileUrl: response.secure_url,
          body,
        },
      });
      if (notice) {
        return res
          .status(201)
          .json(new ApiResponse(201, notice, "Notice Created"));
      }
      return res
        .status(400)
        .json(new ApiError(400, "unable to create the notice"));
    } catch (error) {
      return res
        .status(500)
        .json(new ApiError(500, "Internal server error", error));
    }
  }
  static async editNotice(req, res) {}
}
