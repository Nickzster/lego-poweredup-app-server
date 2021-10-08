import { IDevice, IDeviceData, IDeviceState } from "./index";

abstract class Device implements IDevice {
  protected motor: any;
  protected data: IDeviceData;
  protected state: IDeviceState;
  public constructor(motor) {
    this.motor = motor;
    this.data = {
      color: "",
      direction: 1,
    };
    this.state = {
      power: 0,
    };
    return this;
  }
  protected setState(newState: IDeviceState) {
    this.state = newState;
  }
  protected getState() {
    return this.state;
  }
  protected adjustPower(power: number) {
    let scaled = power;
    if (power > 100) scaled = 100;
    else if (power < -100) scaled = -100;
    return scaled;
  }
  public setPower(power: number) {
    return this.state;
  }
  public brake() {
    return this.state;
  }
  public accelerate(startingPower: number, targetPower: number, time: number) {
    return this.state;
  }
  public changeDirection() {
    return this.state;
  }
}

export default Device;
