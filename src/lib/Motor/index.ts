// TODO: CLEAN UP
// A Device represents physical LEGO POWERED UP hardware.
// It should implement functions that interact with the hardware.

export enum COMMANDS {
  ACCELERATE = "ACCELERATE",
  STOP = "STOP",
  SET_POWER = "SET_POWER",
  CHANGE_MOTOR_DIRECTION = "CHANGE_MOTOR_DIRECTION",
}

export interface IActiveDeviceData {
  meta: IDeviceInfo;
  state: IDeviceState;
}

interface ICommandArgs {
  name: "STOP" | "SET_POWER" | "CHANGE_MOTOR_DIRECTION";
  args?: {
    adjustment: number;
  };
}

interface ICommandExecutionResult {
  data: any;
  success: boolean;
}

export interface IDeviceInfo {
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
  meta: IDeviceInfo;
  motor: any;
}

export interface IMotorCommands {
  execute: (args: ICommandArgs) => ICommandExecutionResult;
  setPower: (adjustment: number) => IDeviceState;
  stop: () => IDeviceState;
  accelerate: (
    startingPower: number,
    targetPower: number,
    time: number
  ) => IDeviceState;
  changeDirection: () => IDeviceState;
  getInfo: () => IActiveDeviceData;
}

export abstract class CustomPoweredUPMotor implements IMotorCommands {
  protected motor: any;
  protected data: IDeviceInfo;
  protected state: IDeviceState;

  public execute(commandArgs: ICommandArgs) {
    const { name, args } = commandArgs;
    let updatedDeviceState;
    if (name === COMMANDS.STOP) {
      updatedDeviceState = this.stop();
    }
    if (name === COMMANDS.SET_POWER) {
      let adjustment = args.adjustment;
      if (!adjustment)
        return {
          success: false,
          data: new Error(
            "Invalid Adjustment Specified (command.args.adjustment is null!)"
          ),
        };

      updatedDeviceState = this.setPower(adjustment);
    }
    if (name === COMMANDS.CHANGE_MOTOR_DIRECTION) {
      updatedDeviceState = this.changeDirection();
    }
    if (!updatedDeviceState) {
      return {
        success: false,
        data: new Error("Invalid Command Specified!"),
      };
    }
    return {
      success: true,
      data: updatedDeviceState,
    };
  }

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

  public getInfo() {
    return {
      meta: null,
      state: null,
    };
  }
}
