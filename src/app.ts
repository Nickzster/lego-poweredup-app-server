import express from "express";
import { TrainFactory } from "./lib/Trains";
import { router as Individual } from "./routes/individual";
import { router as Bulk } from "./routes/bulk";

const app = express();

app.use(express.json());

app.use("/individual", Individual);
app.use("/bulk", Bulk);

TrainFactory.initalize().startScanning();

const PORT = 5000 || process.env.PORT;

app.listen(PORT);
console.log("Application Started Successfully.");
