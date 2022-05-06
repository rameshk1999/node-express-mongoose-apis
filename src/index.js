import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import appRouter from "./routes/index.js";

// inititalization
dotenv.config();
const app = express();
const port = process.env.PORT;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connect to db
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.info("DB connected");
    app.listen(port, () => {
      console.log("connected to port", +port);
    });
  })
  .catch((err) => {
    console.error("connection failed", err);
  });

// routes
app.use("/api/v1/", appRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    time: new Date().toLocaleTimeString(),
  });
});
