import express from "express";
import Command from "../lib/Command";
import Response from "../lib/Response";
import ConnectedTrains from "../lib/Trains";
import { checkName } from "../middleware/checkName";

const router = express.Router();

router.post("/execute", [checkName], async (req, res) => {
  let resp = new Response();
  try {
    const { command, name, value } = req.body;
    let executed = Command.execute({
      command: { commandName: command, value },
      train: ConnectedTrains.initalize().getConnection(name),
    });
    if (executed) {
      resp.succeed(`Successfully executed ${command} on ${name}`);
    } else {
      throw `Failed to execute ${command} on ${name}`;
    }
  } catch (err) {
    resp.failed(err);
  } finally {
    res.status(resp.getStatus()).json(resp.getMessage());
  }
});

export { router };
