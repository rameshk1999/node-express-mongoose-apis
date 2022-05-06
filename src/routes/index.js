import express from "express";
import userRouter from "./userRouter.js";

const appRouter = express.Router();

// user route
appRouter.use("/user", userRouter);

export default appRouter;
