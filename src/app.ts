import express from "express";
import { TrainFactory } from "./lib/Trains";
import { router as Command } from "./routes/bulk";
import cors from "cors";

const app = express();
app.use(cors());
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!!req.get("origin")) {
      res.setHeader("Access-Control-Allow-Origin", `${req.get("origin")}`);
    }
    next();
  }
);

app.use(express.json());

app.use("/", Command);

TrainFactory.initalize().startScanning();

const PORT = 5000 || process.env.PORT;

app.listen(PORT);
console.log("Application Started Successfully.");
