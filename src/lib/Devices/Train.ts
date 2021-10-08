import Device from "./Device";

class Train extends Device {
  public constructor(motor: any) {
    super(motor);
  }
  public accelerate(startingPower: number, targetPower: number, time: number) {
    this.motor.rampPower(
      this.adjustPower(startingPower),
      this.adjustPower(targetPower),
      time
    );
    this.setState({ power: targetPower });
    return this.getState();
  }
  public setPower(power: number) {
    this.motor.setPower(this.adjustPower(power) * this.data.direction);
    this.setState({ power });
    return this.getState();
  }
  public brake() {
    this.motor.brake();
    this.setState({ power: 0 });
    return this.getState();
  }
  public changeDirection() {
    let currentState = this.getState();
    this.data.direction *= -1;
    this.brake();
    this.accelerate(0, currentState.power, 1);
    return this.getState();
  }
}

export default Train;
