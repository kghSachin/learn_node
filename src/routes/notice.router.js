import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { NoticeController } from "../controller/notice.controller.js";

const noticeRouter = express.Router();

noticeRouter.route("/create_notice").post(
  upload.fields([
    {
      name: "noticeFiles",
      maxCount: 1,
    },
  ]),
  NoticeController.createNotice
);

export default noticeRouter;
