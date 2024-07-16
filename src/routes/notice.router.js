import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { NoticeController } from "../controller/notice.controller.js";

const noticeRouter = express.Router();

noticeRouter.route("/create_notice").post(
  upload.fields([
    {
      name: "noticeFiles",
      maxCount: 3,
    },
  ]),
  NoticeController.createNotice
);
noticeRouter.patch("/update_notice/:id", NoticeController.editNotice);
noticeRouter.delete("/delete_notice/:id", NoticeController.deleteNotice);
noticeRouter.get("/notice", NoticeController.getNotice);

export default noticeRouter;
