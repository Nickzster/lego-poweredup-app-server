import express from "express";
import { COMMANDS } from "../lib/Motor";
import ConnectedDevices from "../lib/PoweredUPAPI/ConnectedDevices";

const router = express.Router();

router.post("/execute/:id", async (req, res) => {
  try {
    const { command } = req.body;
    const { name, args } = command;
    const device = req.params.id;
    let connection = ConnectedDevices.initalize().getConnection(device);
    if (!connection) throw new Error("Null Device!");
    let state;
    if (name === COMMANDS.STOP) {
      state = connection.stop();
    }
    if (name === COMMANDS.SET_POWER) {
      let adjustment = args.adjustment;
      if (!adjustment) {
        throw new Error(
          "Invalid Adjustment Specified (command.args.adjustment is null!)"
        );
      }
      state = connection.setPower(adjustment);
    }
    if (name === COMMANDS.CHANGE_DIRECTION) {
      state = connection.changeDirection();
    }
    if (!state) {
      throw new Error("Invalid Command Specified!");
    }
    return res.status(200).json(state);
  } catch (err) {
    res.status(400).json({ msg: err.message || "Unknown error!" });
  }
});

export { router };
