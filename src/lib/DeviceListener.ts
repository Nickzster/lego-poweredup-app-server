import PoweredUP, { Consts } from "node-poweredup";
import Color from "./Colors";
import ConnectedTrains from "./ConnectedDevices";
import { IDevice, Train, Coaster } from "./Devices";

type DeviceType = "train" | "coaster";

class DeviceFactory {
  private type: string;
  private device: IDevice | null;
  private motor;
  private needToBuild(typeGiven: string) {
    return !this.device && this.type === typeGiven;
  }
  private constructor(deviceType: string, motor) {
    this.type = deviceType;
    this.motor = motor;
    this.device = null;
    return this;
  }
  private getDevice() {
    return this.device;
  }
  public static build(deviceType: string, motor) {
    return new DeviceFactory(deviceType, motor)
      .buildCoaster()
      .buildTrain()
      .getDevice();
  }

  private buildTrain() {
    if (this.needToBuild("train")) {
      this.device = new Train(this.motor);
    }
    return this;
  }
  private buildCoaster() {
    if (this.needToBuild("coaster")) {
      this.device = new Coaster(this.motor);
    }
    return this;
  }
}

class DeviceListener {
  private static instance: DeviceListener;
  private poweredUp;
  private enabled: boolean;
  private constructor() {
    this.enabled = true;
    this.poweredUp = new PoweredUP();
    return this;
  }

  private setUp() {
    this.poweredUp.on("discover", async (hub) => {
      let hubName: string = hub.name;
      let hubInformation = hubName.split("-");
      let [name, type] = hubInformation;
      console.log(`Discovered ${hub.name}!`);
      console.log(`Transforming ${hub.name} to ${hubInformation}`);
      let connections = ConnectedTrains.initalize();
      try {
        if (!this.enabled) {
          throw "Trains is not allowing any connections at the moment!";
        }
        if (connections.getConnection(hub.name)) {
          throw "WARNING: Device with Duplicate Name detected. Rejecting this connection!";
        }
        if (!name || !type) {
          throw `Rejecting device ${hub.name} because it was not named properly! Devices should be named <name>-<type>`;
        }
        await hub.connect();
        const motor = await hub.waitForDeviceAtPort("A");
        const led = await hub.waitForDeviceByType(Consts.DeviceType.HUB_LED);
        led.setColor(new Color().get());
        connections.addConnection(hub.name, DeviceFactory.build(type, motor));
      } catch (msg) {
        console.log(msg);
      }
    });
    return this;
  }

  private startScanning() {
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
