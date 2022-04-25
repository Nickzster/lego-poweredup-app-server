import PoweredUP, { Consts } from "node-poweredup";
import Color from "./Colors";
import ConnectedDevices from "./ConnectedDevices";
import { v4 as uuidv4 } from "uuid";
import DeviceFactory from "./DeviceFactory";

class DeviceListener {
  private static instance: DeviceListener;
  private poweredUp;
  private constructor() {
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

  private setUpListener() {
    this.poweredUp.on("discover", async (hub) => {
      try {
        console.log(`Discovered ${hub.name}`);
        // String processing to create a clean device name for client.
        let hubName: string = hub.name;
        let type = this.getType(hubName);
        let deviceName = this.getDeviceName(hubName);
        let deviceID = this.generateId();
        console.log(
          `Device created as ${deviceName} and has assigned ID ${deviceID}!`
        );
        // Connected Devices is a singleton managing all connected PoweredUP motors.
        let connections = ConnectedDevices.initalize();
        // The PoweredUP hubs should be named properly in order to be added to the connected devices.
        if (connections.getConnection(hub.name))
          throw `WARNING: Device with duplicate name detected. Ignoring duplicate device ${hubName}!`;
        if (type === "INVALID")
          throw `Device is of type INVALID. Please name device with prefix 'trn_' or 'cst_'. Ignoring ${hubName}!`;
        await hub.connect();
        // PoweredUP API Device setup logic
        const motor = await hub.waitForDeviceAtPort("A");
        const led = await hub.waitForDeviceByType(Consts.DeviceType.HUB_LED);
        const deviceColor = new Color().get();
        led.setColor(deviceColor);
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

  private startListeningForPoweredUPDevices() {
    console.log("Scanning for devices...");
    this.poweredUp.scan();
    return this;
  }

  public static start() {
    if (!DeviceListener.instance) {
      DeviceListener.instance = new DeviceListener()
        .setUpListener()
        .startListeningForPoweredUPDevices();
    }
    return DeviceListener.instance;
  }
}

export default DeviceListener;
