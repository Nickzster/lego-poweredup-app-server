import express from "express";
import Command from "../lib/Command";
import Response from "../lib/Response";
import ConnectedTrains from "../lib/Trains";

const router = express.Router();

//BULK commands
router.post("/execute", async (req, res) => {
  let resp = new Response();
  try {
    const { command, value, trains } = req.body;
    if (command !== "power" && command !== "brake" && command !== "direction")
      throw "This command cannot be applied in bulk!";
    let connections;
    if (!!trains && Array.isArray(trains)) {
      let allConnections = ConnectedTrains.initalize();
      let selected = trains.map((train) => {
        let connection = allConnections.getConnection(train);
        if (connection) {
          return connection;
        }
      });
      connections = selected;
    } else {
      connections = ConnectedTrains.initalize().getAllConnections();
    }
    connections.forEach((connection) =>
      Command.execute({
        command: { commandName: command, value },
        train: connection,
      })
    );
    resp.succeed("Commands were applied to the specified trains!");
  } catch (err) {
    resp.failed(err);
  } finally {
    res.status(resp.getStatus()).json(resp.getMessage());
  }
});

export { router };
