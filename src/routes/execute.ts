import express from "express";
import ConnectedDevices from "../lib/PoweredUPAPI/ConnectedDevices";

const router = express.Router();

// POST Execute
// Params: id -> Device ID To modify
// Body Syntax: command: ICommandArgs

router.post("/execute/:id", async (req, res) => {
  const { command } = req.body;
  const deviceId = req.params.id;
  const connection = ConnectedDevices.initalize().getConnection(deviceId);
  if (!connection) return res.status(400).json({ msg: "Null Device!" });
  const state = connection.execute(command);
  if (state.success) return res.status(200).json(state.data);
  return res.status(400).json({ msg: state.data || "Unknown error!" });
});

export { router };
