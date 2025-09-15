import express, { Express } from "express";
import authRouter from "./routes/auth.router";
import { MErrorHandler } from "./middlewares/error.middleware";
import cors from "cors";
import dotenv from "dotenv";
import { connectRedis } from "./configs/redis.config";

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Yatta"));
connectRedis();

// Mount router
console.log("Auth content:", authRouter);
app.use("/api/v1/auth", authRouter);

// Error handling
app.use(MErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
