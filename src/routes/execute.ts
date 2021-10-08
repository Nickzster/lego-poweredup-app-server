import express from "express";
import Command from "../lib/Command";
import Response from "../lib/Response";
import ConnectedDevices from "../lib/ConnectedDevices";

const router = express.Router();

router.post("/execute", async (req, res) => {
  let resp = new Response();
  try {
    const { command, value, devices } = req.body;
    let connections;
    if (!!devices && Array.isArray(devices)) {
      let allConnections = ConnectedDevices.initalize();
      let selected = devices.map((device) => {
        let connection = allConnections.getConnection(device);
        if (connection) {
          return connection;
        }
      });
      connections = selected;
    } else {
      connections = ConnectedDevices.initalize().getAllConnections();
    }
    connections.forEach((connection) =>
      Command.execute({
        command: { commandName: command, value },
        train: connection,
      })
    );
    resp.succeed("Commands were applied to the specified devices!");
  } catch (err) {
    resp.failed(err);
  } finally {
    res.status(resp.getStatus()).json(resp.getMessage());
  }
});

export { router };
