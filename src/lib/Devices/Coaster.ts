import Device from "./Device";

class Coaster extends Device {
  public accelerate(startingPower: number, targetPower: number, time: number) {
    this.motor.rampPower(0, 100, 1);
    this.setState({ power: 100 });
    return this.getState();
  }
  public brake() {
    this.motor.brake();
    this.setState({ power: 0 });
    return this.getState();
  }
  public setPower(power: number) {
    this.accelerate(0, 100, 1);
    this.setState({ power: 100 });
    return this.getState();
  }
}

export default Coaster;
