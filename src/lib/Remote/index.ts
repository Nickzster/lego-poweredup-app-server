import { v4 as uuidv4 } from "uuid";
import { getMotorByID } from "../maps";
import { IDeviceState } from "../Motor";

export enum COMMANDS {
  INCREASE_POWER = "INCREASE_POWER",
  DECREASE_POWER = "DECREASE_POWER",
  STOP = "STOP",
  CHANGE_MOTOR_DIRECTION = "CHANGE_MOTOR_DIRECTION",
}

interface ICommandSyntax {
  name:
    | COMMANDS.INCREASE_POWER
    | COMMANDS.DECREASE_POWER
    | COMMANDS.STOP
    | COMMANDS.CHANGE_MOTOR_DIRECTION;
  args?: {
    delta: number;
  };
}

export interface IRemote {
  execute: (command: ICommandSyntax) => IDeviceState[];
  getId: () => string;
  addMotor: (key: string) => boolean;
  removeMotor: (key: string) => boolean;
}

class Remote implements IRemote {
  private motorKeys: string[];
  private id: string;

  public constructor(newRemoteID: string = uuidv4(), newMotorID?: string) {
    this.motorKeys = [];
    if (newMotorID) this.motorKeys.push(newMotorID);
    this.id = newRemoteID;
    return this;
  }

  public addMotor(key: string) {
    this.motorKeys.push(key);
    return true;
  }

  public removeMotor(key: string) {
    // Do a filter to remove element
    return true;
  }

  public execute(command: ICommandSyntax) {
    const newState = [];
    console.log("Remote.execute called!");
    this.motorKeys.forEach((motorKey) => {
      console.log("Executing Motor Key: ", motorKey);
      const delta = command.args?.delta || 10;
      const motor = getMotorByID(motorKey);
      if (!motor) {
        newState.push({});
        return;
      }
      let newMotorState = motor.getDeviceData().state;

      console.log(`RemoteInstance: Executing ${command.name} with ${delta}`);
      switch (command.name) {
        case COMMANDS.INCREASE_POWER: {
          motor.setPower(delta);
          newMotorState = motor.getDeviceData().state;
          break;
        }

        case COMMANDS.DECREASE_POWER: {
          motor.setPower(delta * -1);
          newMotorState = motor.getDeviceData().state;
          break;
        }

        case COMMANDS.STOP: {
          motor.stop();
          newMotorState = motor.getDeviceData().state;
          break;
        }

        case COMMANDS.CHANGE_MOTOR_DIRECTION: {
          motor.changeDirection();
          newMotorState = motor.getDeviceData().state;
          break;
        }
      }

      newState.push(newMotorState);
    });
    return newState;
  }

  public getId() {
    return this.id;
  }
}

export default Remote;
