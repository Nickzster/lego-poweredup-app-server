export interface IDeviceMetadata {
  id: string;
  name: string;
  type: string;
}

export interface IDeviceState {
  power: number;
  color: any;
  direction: 1 | -1;
}

export interface IDeviceData {
  state: IDeviceState;
  metadata: IDeviceMetadata;
}

export interface IMotorCommands {
  setPower: (adjustment: number) => IDeviceState;
  stop: () => IDeviceState;
  accelerate: (
    startingPower: number,
    targetPower: number,
    time: number
  ) => IDeviceState;
  changeDirection: () => IDeviceState;
  getDeviceData: () => IDeviceData;
}

export abstract class CustomPoweredUPMotor implements IMotorCommands {
  protected motor: any;
  protected data: IDeviceMetadata;
  protected state: IDeviceState;

  public setPower(adjustment: number) {
    return this.state;
  }

  public stop() {
    return this.state;
  }

  public accelerate(startingPower: number, targetPower: number, time: number) {
    return this.state;
  }

  public changeDirection() {
    return this.state;
  }

  public getDeviceData() {
    return {
      metadata: this.data,
      state: this.state,
    };
  }
}
