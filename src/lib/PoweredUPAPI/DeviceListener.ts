import PoweredUP, { Consts } from "node-poweredup";
import Color from "./Colors";
import ConnectedDevices from "./ConnectedDevices";
import { v4 as uuidv4 } from "uuid";
import { IDevice, Train } from "../Motor";
import DeviceFactory from "./DeviceFactory";

type DeviceType = "train" | "coaster";

class DeviceListener {
  private static instance: DeviceListener;
  private poweredUp;
  private enabled: boolean;
  private constructor() {
    this.enabled = true;
    this.poweredUp = new PoweredUP();
    return this;
  }

  private generateId() {
    return uuidv4();
  }

  private getDeviceName(hubName: string) {
    return hubName.split("_").pop();
  }

  private getType(hubName: string): "train" | "coaster" | "INVALID" {
    const prefix = hubName[0] + hubName[1] + hubName[2];
    if (prefix === "trn") return "train";
    if (prefix === "cst") return "coaster";
    return "INVALID";
  }

  private setUp() {
    this.poweredUp.on("discover", async (hub) => {
      try {
        console.log(`Discovered ${hub.name}`);
        let hubName: string = hub.name;
        let type = this.getType(hubName);
        let deviceName = this.getDeviceName(hubName);
        let deviceID = this.generateId();
        console.log(`Renaming to ${deviceName} and assigning ID ${deviceID}`);
        let connections = ConnectedDevices.initalize();
        if (!this.enabled)
          throw `Trains is not allowing any connections at the moment! Rejecting ${hubName}!`;
        if (connections.getConnection(hub.name))
          throw `WARNING: Device with Duplicate Name detected. Rejecting ${hubName}!`;
        if (type === "INVALID")
          throw `Device is of type INVALID. Please name device with prefix 'trn_' or 'cst_'. Rejecting ${hubName}!`;
        await hub.connect();
        const motor = await hub.waitForDeviceAtPort("A");
        const led = await hub.waitForDeviceByType(Consts.DeviceType.HUB_LED);
        led.setColor(new Color().get());
        connections.addConnection(
          deviceID,
          DeviceFactory.build({
            meta: { id: deviceID, name: deviceName, type: type },
            motor: motor,
          })
        );
      } catch (msg) {
        console.log(msg);
      }
    });
    return this;
  }

  private startScanning() {
    console.log("Scanning for devices...");
    this.poweredUp.scan();
    return this;
  }

  public static start() {
    if (!DeviceListener.instance) {
      DeviceListener.instance = new DeviceListener().setUp().startScanning();
    }
    return DeviceListener.instance;
  }
}

export default DeviceListener;
