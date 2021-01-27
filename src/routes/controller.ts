import express from "express";
import { TechnicMediumHubTiltSensor } from "node-poweredup";
import Trains from "../lib/Trains";

const router = express.Router();

interface IResponse {
  status: number;
  message: string;
}

class Response {
  private status: number;
  private message: string;
  public constructor(
    args: IResponse = { status: 200, message: "Command issued successfully." }
  ) {
    this.status = args.status;
    this.message = args.message;
  }
  public succeed(message: string) {
    this.status = 200;
    this.message = message;
    return this;
  }
  public failed(message: string, code = 500) {
    this.status = code;
    this.message = message;
    return this;
  }
  public getStatus() {
    return this.status;
  }
  public getMessage() {
    return { message: this.message };
  }
  public build() {
    return {
      status: this.status,
      message: this.message,
    };
  }
}

interface IBody {
  power?: number;
  name?: string;
}

router.post("/direction", [], async (req, res) => {
  let resp = new Response();
  try {
    const body = req.body;
    let train = Trains.initalize();
    const { name } = body;
    if (!name) {
      throw "You need to specify a train to change the direction properly!";
    }
    train.changeDirections(name);
    resp.succeed("Direction changed!");
  } catch (err) {
    resp.failed(err);
  } finally {
    res.status(resp.getStatus()).json(resp.getMessage());
  }
});

router.post("/power", [], async (req, res) => {
  let resp = new Response();
  try {
    const body = req.body;
    let train = Trains.initalize();
    const { power, name } = body;
    const powerIsValid = (power) => {
      if (typeof power === "number") return true;
      return !!power;
    };
    if (!powerIsValid(power))
      throw "You need to specify the power in the body!";
    if (!name) {
      //Provide Power to all trains
      train.setPowerToAll(power);
    } else {
      //Provide Power to single train
      train.setPower(name, power);
    }
    resp.succeed("Power set!");
  } catch (err) {
    resp.failed(err);
  } finally {
    res.status(resp.getStatus()).json(resp.getMessage());
  }
});

router.post("/brake", [], async (req, res) => {
  let resp = new Response();
  try {
    const body = req.body;
    let train = Trains.initalize();
    const { name } = body;
    if (!name) {
      //Brake specific train
      train.brakeAll();
    } else {
      //Brake all
      train.brake(name);
    }
  } catch (err) {
    resp.failed(err);
  } finally {
    res.status(resp.getStatus()).json(resp.getMessage());
  }
});

export { router };
