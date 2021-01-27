import express from "express";
import Trains from "./lib/Trains";
import { router as Controller } from "./routes/controller";

const app = express();

app.use(express.json());

app.use("/", Controller);

Trains.initalize().startScanning();

const PORT = 5000 || process.env.PORT;

app.listen(PORT);
console.log("Application Started Successfully.");
