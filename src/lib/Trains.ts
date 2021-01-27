import PoweredUP, { Consts } from "node-poweredup";
import Color from "./Colors";

interface Train {
  color: any;
  direction: 1 | -1;
  motor: any;
}

class Trains {
  private static instance: Trains;
  private poweredUp;
  private connections: Map<string, Train>;
  private enabled: boolean;
  private constructor() {
    this.enabled = true;
    this.poweredUp = new PoweredUP();
    this.connections = new Map<string, Train>();
    return this;
  }
  private setUp() {
    this.poweredUp.on("discover", async (hub) => {
      console.log(`Discovered ${hub.name}!`);
      try {
        if (!this.enabled) {
          throw "Trains is not allowing any connections at the moment!";
        }
        if (this.connections.get(hub.name)) {
          console.log(
            "WARNING: Device with Duplicate Name detected. It will be overrided!"
          );
        }
        await hub.connect();
        const motor = await hub.waitForDeviceAtPort("A");
        const led = await hub.waitForDeviceByType(Consts.DeviceType.HUB_LED);
        led.setColor(new Color().get());
        this.connections.set(hub.name, {
          color: Consts.Color.PURPLE,
          direction: 1,
          motor: motor,
        });
      } catch (msg) {
        console.log(msg);
      }
    });
    return this;
  }
  private getDevice(name: string) {
    let device = this.connections.get(name);
    if (!device) return null;
    return device;
  }
  private getOpposite(value: 1 | -1) {
    if (value === 1) return -1;
    return 1;
  }
  private adjustPower(power: number) {
    if (power > 100) return 100;
    if (power < -100) return -100;
    return power;
  }

  public startScanning() {
    this.poweredUp.scan();
  }

  public static initalize() {
    if (!Trains.instance) {
      Trains.instance = new Trains().setUp();
    }
    return Trains.instance;
  }
  public changeDirections(name: string) {
    let device = this.getDevice(name);
    if (!!device) {
      this.connections.get(name).direction = this.getOpposite(device.direction);
    }
  }
  public setPower(name: string, power: number) {
    let device = this.getDevice(name);
    if (!!device) {
      device.motor.setPower(this.adjustPower(power) * device.direction);
    }
  }
  public brake(name: string) {
    let device = this.getDevice(name);
    if (!!device) {
      device.motor.brake();
    }
  }
  public brakeAll() {
    this.connections.forEach((device) => {
      device.motor.brake();
    });
  }
  public setPowerToAll(power: number) {
    this.connections.forEach((device) => {
      device.motor.setPower(this.adjustPower(power) * device.direction);
    });
  }
}

export default Trains;
