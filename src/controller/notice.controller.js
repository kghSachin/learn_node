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
  static async editNotice(req, res) {
    const id = req.params.id;
    const { title, body } = req.body;
    console.log(id, title, body);
    // const localFilePath = req.files?.noticeFiles[0]?.path;
    if (!title) {
      return res
        .status(400)
        .json(new ApiError(400, "Notice title cant't be empty"));
    }

    // uploadOnCloudinary(localFilePath, "notice", "pdf" || "jpeg" || "png" || "jpg");
    try {
      console.log("id", id);
      const post = await prisma.notice.findFirst({
        where: {
          id,
        },
      });
      if (!post) {
        return res.status(404).json(new ApiError(404, "Notice not found"));
      }
      console.log("post", post);
      // console.log(post);

      const notice = await prisma.notice.update({
        where: {
          id: id,
        },
        data: {
          title,
          body,
          // fileUrl: localFilePath,
        },
      });
      if (notice) {
        return res
          .status(200)
          .json(new ApiResponse(200, notice, "Notice updated"));
      }
      return res
        .status(400)
        .json(new ApiError(400, "unable to update the notice"));
    } catch (error) {
      return res
        .status(500)
        .json(new ApiError(500, "Internal server error", error));
    }
  }
  static async deleteNotice(req, res) {
    const id = req.params.id;
    try {
      const isValid = await prisma.notice
        .findFirst({
          where: {
            id,
          },
        })
        .then((data) => {
          if (data) {
            return true;
          }
          return false;
        });
      if (!isValid) {
        return res
          .status(404)
          .json(new ApiError(404, "Invalid Delete Request"));
      }
      const notice = await prisma.notice.delete({
        where: {
          id,
        },
      });
      if (notice) {
        return res
          .status(200)
          .json(new ApiResponse(200, notice, "Notice Deleted"));
      }
      return res
        .status(400)
        .json(new ApiError(400, "unable to delete the notice"));
    } catch (err) {
      return res
        .status(500)
        .json(new ApiError(500, "Internal server error", err));
    }
  }
  static async getNotice(req, res) {
    try {
      const notices = await prisma.notice.findMany();
      if (notices) {
        return res
          .status(200)
          .json(new ApiResponse(200, notices, "All Notices"));
      }
      return res.status(400).json(new ApiError(400, "No Notices found"));
    } catch (error) {
      return res
        .status(500)
        .json(new ApiError(500, "Internal server error", error));
    }
  }
}
