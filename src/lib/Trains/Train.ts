export interface ITrain {
  setPower: Function;
  brake: Function;
}

interface ITrainData {
  color: any;
  direction: 1 | -1;
}

class Train {
  private motor: any;
  private data: ITrainData;
  public constructor(motor) {
    this.motor = motor;
    this.data = {
      color: "",
      direction: 1,
    };
    return this;
  }
  private adjustPower(power: number) {
    let scaled = power;
    if (power > 100) scaled = 100;
    else if (power < -100) scaled = -100;
    return scaled;
  }
  public setPower(power: number) {
    this.motor.setPower(this.adjustPower(power) * this.data.direction);
  }
  public brake() {
    this.motor.brake();
  }
  public changeDirection() {
    this.data.direction *= -1;
    return this;
  }
}

export default Train;
