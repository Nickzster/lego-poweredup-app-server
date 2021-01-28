import PoweredUP, { Consts } from "node-poweredup";
import Color from "../Colors";
import ConnectedTrains from "./ConnectedTrains";
import Train from "./Train";

class TrainFactory {
  private static instance: TrainFactory;
  private poweredUp;
  private enabled: boolean;
  private constructor() {
    this.enabled = true;
    this.poweredUp = new PoweredUP();
    return this;
  }
  private setUp() {
    this.poweredUp.on("discover", async (hub) => {
      //   let hubName = hub.name
      //     .toUpperCase()
      //     .replace(new RegExp("[a-zA-Z0-9]s[a-zA-Z0-9]g"), "_");
      let hubName = hub.name;
      console.log(`Discovered ${hub.name}!`);
      console.log(`Transforming ${hub.name} to ${hubName}`);
      let connections = ConnectedTrains.initalize();
      try {
        if (!this.enabled) {
          throw "Trains is not allowing any connections at the moment!";
        }
        if (connections.getConnection(hub.name)) {
          throw "WARNING: Device with Duplicate Name detected. Rejecting this connection!";
        }
        await hub.connect();
        const motor = await hub.waitForDeviceAtPort("A");
        const led = await hub.waitForDeviceByType(Consts.DeviceType.HUB_LED);
        led.setColor(new Color().get());
        connections.addConnection(hub.name, new Train(motor));
      } catch (msg) {
        console.log(msg);
      }
    });
    return this;
  }
  public startScanning() {
    this.poweredUp.scan();
    return this;
  }

  public static initalize() {
    if (!TrainFactory.instance) {
      TrainFactory.instance = new TrainFactory().setUp().startScanning();
    }
    return TrainFactory.instance;
  }
}

export default TrainFactory;
