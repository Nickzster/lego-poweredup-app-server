import express from "express";
import ConnectedDevices from "../lib/PoweredUPAPI/ConnectedDevices";

const router = express.Router();

router.get("/all-devices", async (req, res) => {
  const connections = ConnectedDevices.initalize().getAllConnections();
  res.status(200).json({ connections: connections });
});

export { router };
