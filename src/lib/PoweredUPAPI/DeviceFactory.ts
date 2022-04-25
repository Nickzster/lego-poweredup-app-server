import { IMotorCommands, IDeviceData, Train } from "../Motor";

class DeviceFactory {
  private meta;
  private motor;
  private device: IMotorCommands | null;

  private constructor(meta, motor) {
    this.meta = meta;
    this.motor = motor;
    this.device = null;
    return this;
  }

  private buildTrain() {
    if (this.meta.type === "train")
      this.device = new Train({
        meta: this.meta,
        motor: this.motor,
      });
    return this;
  }

  public static build(deviceInfo: IDeviceData) {
    const deviceInstance = new DeviceFactory(
      deviceInfo.meta,
      deviceInfo.motor
    ).buildTrain();
    return deviceInstance.device;
  }
}

export default DeviceFactory;
