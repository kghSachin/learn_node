import express from "express";
import cors from "cors";
import router from "./routes/employee.router.js";
import noticeRouter from "./routes/notice.router.js";
import userRoute from "./routes/user.route.js";

const app = express();
app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use("/", router);
app.use("/", noticeRouter);
app.use("/", userRoute);

export { app };
