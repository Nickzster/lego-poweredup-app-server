import { IDeviceData, CustomPoweredUPMotor } from "./index";

class Train extends CustomPoweredUPMotor {
  private scalePower(power: number) {
    let scaled = power;
    if (power > 100) scaled = 100;
    else if (power < -100) scaled = -100;
    return scaled;
  }

  private scaleAdjustment(adjustment: number) {
    let finalAdjustment;
    if (adjustment <= 10 && adjustment >= -10) finalAdjustment = adjustment;
    else if (adjustment > 0) finalAdjustment = 10;
    else finalAdjustment = -10;
    return finalAdjustment;
  }

  public constructor(device: IDeviceData) {
    super();
    this.motor = device.motor;

    this.data = {
      id: device.meta.id,
      name: device.meta.name,
      type: device.meta.type,
    };
    this.state = {
      power: 0,
      color: "",
      direction: 1,
    };
    this.motor.setPower(this.state.power);
    return this;
  }
  public setPower(adjustment: number) {
    let scaledAdjustment =
      this.scaleAdjustment(adjustment) * this.state.direction;
    let modifiedPower = this.state.power + scaledAdjustment;
    let scaledPower = this.scalePower(modifiedPower);
    let finalPower = scaledPower;
    this.motor.setPower(finalPower);
    this.state.power = finalPower;
    return this.state;
  }

  public stop() {
    this.motor.brake();
    this.state.power = 0;
    return this.state;
  }

  public accelerate() {
    return this.state;
  }

  public changeDirection() {
    //TODO: Need to get this working in reverse state.
    this.state.direction *= -1;
    this.stop();
    return this.state;
  }

  public getInfo() {
    return {
      meta: this.data,
      state: this.state,
    };
  }
}

export default Train;
