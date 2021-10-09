import { IDevice, IDeviceData, Train } from "../Motor";

class DeviceFactory {
  private type: string;
  private device: IDevice | null;
  private motor;

  private constructor(deviceType: string, motor) {
    this.type = deviceType;
    this.motor = motor;
    this.device = null;
    return this;
  }
  public static build(deviceInfo: IDeviceData) {
    const { meta, motor } = deviceInfo;
    switch (meta.type) {
      case "train":
        return new Train({ meta, motor });
      default:
        return null;
    }
  }
}

export default DeviceFactory;
