import { v4 as uuidv4 } from "uuid";
import { connectedMotors } from "../consts";
import { IDeviceData, IDeviceState } from "../Motor";

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
  execute: (command: ICommandSyntax) => void; // Executes incoming message
  getRemoteID: () => string; // Get the ID of this remote.
  addMotor: (key: string) => boolean; // Add a motor to this remote.
  moveMotorToNewRemote: (newRemoteKey: string, motorToMove: string) => boolean; // Migrate a motor to a new remote
  getMotorData: () => IDeviceData[]; // Aggregate all motor data into an array.
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

  public getMotorData() {
    return this.motorKeys.map((motorKey) =>
      connectedMotors.get(motorKey).getDeviceData()
    );
  }

  public getRemoteID() {
    return this.id;
  }

  public addMotor(key: string) {
    this.motorKeys.push(key);
    return true;
  }

  public moveMotorToNewRemote(newRemoteKey: string, motorToMove: string) {
    // TODO: Move Motor to new Remote.
    return true;
  }

  public execute(command: ICommandSyntax) {
    this.motorKeys.forEach((motorKey) => {
      console.log("Executing Motor Key: ", motorKey);
      const delta = command.args?.delta || 10;
      const motor = connectedMotors.get(motorKey);
      if (!motor) {
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
    });
  }

  public getId() {
    return this.id;
  }
}

export default Remote;
