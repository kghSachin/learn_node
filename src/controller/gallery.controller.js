import express from "express";
import prisma from "../../DB/db.config.js";
import ApiResponse from "../utils/api_response.js";
import uploadOnCloudinary from "../utils/cloudinary.config.js";
import { ApiError } from "../utils/error_response.js";

export class GalleryController {
  static async createGalleryNotice(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json(new ApiError(401, " Not Authenticated "));
      }
      if (user.role !== "ADMIN") {
        return res
          .status(403)
          .json(new ApiError(403, "You are not authorized to create notice"));
      }
      console.log("user is ", user);
      const { title, body } = req.body;
      const files = req.files;
      console.log("up and running ", files);
      let localFilePath = [];
      files.map((file) => {
        localFilePath.push(file.path);
      });
      console.log("local file path", localFilePath);
      const uploadPromises = localFilePath.map((path) =>
        uploadOnCloudinary(path, "gallery", "jpeg" || "png" || "jpg")
      );
      const response = await Promise.all(uploadPromises);
      if (!response) {
        return res
          .status(400)
          .json(new ApiError(400, "unable to upload files"));
      }
      console.log(response);
      const gallery = await prisma.gallery.create({
        data: {
          title,
          body,
          imageUrl: [...response.map((res) => res.secure_url)],
        },
      });
      if (gallery) {
        console.log(gallery);
        return res
          .status(201)
          .json(new ApiResponse(201, gallery, "Gallery Created"));
      }
      return res
        .status(400)
        .json(new ApiError(400, "unable to create the gallery", gallery));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(new ApiError(500, "Internal server error", error));
    }
  }
  static async editGalleryNotice(req, res) {
    const id = req.params.id;
    const { title, body } = req.body;
    const files = req.files;
    let localFilePath = [];
    files.map((file) => {
      localFilePath.push(file.path);
    });
    const uploadPromises = localFilePath.map((path) =>
      uploadOnCloudinary(path, "gallery", "jpeg" || "png" || "jpg")
    );
    const response = await Promise.all(uploadPromises);
    if (!response) {
      return res.status(400).json(new ApiError(400, "unable to upload files"));
    }
    const gallery = await prisma.gallery.update({
      where: {
        id: id,
      },
      data: {
        title,
        body,
        imageUrl: [...response.map((res) => res.secure_url)],
      },
    });
    if (gallery) {
      return res
        .status(200)
        .json(new ApiResponse(200, gallery, "Gallery Updated"));
    }
    return res
      .status(400)
      .json(new ApiError(400, "unable to update the gallery"));
  }

  static async deleteGalleryNotice(req, res) {
    try {
      const user = req.user;
      const id = req.params.id;
      if (!user) {
        return res.status(401).json(new ApiError(401, " Not Authenticated "));
      }
      if (!id) {
        return res
          .status(400)
          .json(new ApiError(400, "Gallery id is required"));
      }
      const gallery = await prisma.gallery.delete({
        where: {
          id,
        },
      });
      if (gallery) {
        return res
          .status(200)
          .json(new ApiResponse(200, gallery, "Gallery Deleted"));
      }
      return res
        .status(400)
        .json(new ApiError(400, "unable to delete the gallery"));
    } catch (error) {
      res.status(500).json(new ApiError(500, "Internal server error", error));
    }
  }
}
