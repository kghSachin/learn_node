import express from "express";
import { GalleryController } from "../controller/gallery.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const galleryRouter = express.Router();

galleryRouter.post(
  "/create_gallery",
  verifyJWT,
  upload.array("imageUrl", 5),
  GalleryController.createGalleryNotice
);
galleryRouter.delete(
  "/delete_gallery/:id",
  verifyJWT,
  GalleryController.deleteGalleryNotice
);
galleryRouter.get("/get_gallery", GalleryController.getGalleryNotice);
galleryRouter.get("/get_gallery/:id", GalleryController.fetchGalleryById);
export default galleryRouter;
