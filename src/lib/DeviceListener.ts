import PoweredUP, { Consts } from "node-poweredup";
import Color from "./Colors";
import { v4 as uuidv4 } from "uuid";
import WSServer from "./WSServer";
import TrainMotor from "./Motor/Train";
import Remote from "./Remote";
import { connectedMotors, remotes } from "./consts";
import EventPipeline from "./EventPipeline";
import { IMessageForServer } from "./EventPipeline/Message";

class DeviceListener {
  private static instance: DeviceListener;
  private poweredUp;
  private constructor() {
    this.poweredUp = new PoweredUP();
    return this;
  }

  private setupLogicalMotor(motor: any, deviceName: string) {
    const newDeviceID = uuidv4();
    const newRemoteID = uuidv4();

    const newDevice = new TrainMotor(motor, {
      id: newDeviceID,
      name: deviceName,
      type: "train",
    });

    const newRemote = new Remote(newRemoteID, newDeviceID);

    connectedMotors.set(newDeviceID, newDevice);
    remotes.set(newRemoteID, newRemote);

    const messageForServer: IMessageForServer = {
      type: "GET_ALL_ACTIVE_REMOTES",
      remoteID: newRemoteID,
      motorID: newRemoteID,
      payload: {},
    };

    EventPipeline.getInstance().processMessage(messageForServer);

    console.log(
      `Successfully paired device ${deviceName} to ID ${newDeviceID}`
    );
  }

  private setUpListener() {
    this.poweredUp.on("discover", async (hub) => {
      try {
        console.log(`Discovered ${hub.name}`);
        // String processing to create a clean device name for client.
        let hubName: string = hub.name;
        // The PoweredUP hubs should be named properly in order to be added to the connected devices.
        await hub.connect();
        // PoweredUP API Device setup logic
        const motor = await hub.waitForDeviceAtPort("A");
        const led = await hub.waitForDeviceByType(Consts.DeviceType.HUB_LED);
        const deviceColor = new Color().get();
        led.setColor(deviceColor);
        // Train Setup Complete, Need to bind it to a motor.
        this.setupLogicalMotor(motor, hubName);
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
