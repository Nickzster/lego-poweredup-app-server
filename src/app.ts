import express from "express";
import DeviceListener from "./lib/PoweredUPAPI/DeviceListener";
import { router as Execute } from "./routes";
import { router as State } from "./routes/state";
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

app.use("/", Execute);

app.use("/state", State);

DeviceListener.start();

const PORT = 5000 || process.env.PORT;

app.listen(PORT);
console.log("Application Started Successfully.");
