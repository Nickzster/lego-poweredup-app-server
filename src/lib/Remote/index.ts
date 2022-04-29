import { v4 as uuidv4 } from "uuid";
import Color from "../Colors";
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
  execute: (command: ICommandSyntax, motorID?: string) => void; // Executes incoming message
  getRemoteID: () => string; // Get the ID of this remote.
  addMotor: (key: string) => boolean; // Add a motor to this remote.
  remoteMotorFromRemote: (motorKeyToRemove: string) => void; // Migrate a motor to a new remote
  getMotorData: () => IDeviceData[]; // Aggregate all motor data into an array.
  getRemoteColor: () => number; //Return the color of the remote.
}

class Remote implements IRemote {
  private motorKeys: string[];
  private id: string;
  private color: number;

  private changeMotorColor(motorID: string) {
    let motor = connectedMotors.get(motorID);
    console.log("MOTOR", motor);
    motor.setLEDToColor(this.color);
  }

  public getRemoteColor() {
    return this.color;
  }

  public constructor(newRemoteID: string = uuidv4(), newMotorID?: string) {
    this.motorKeys = [];
    this.color = new Color().get();
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
    this.changeMotorColor(key);
    return true;
  }

  public remoteMotorFromRemote(motorKeyToRemove: string) {
    this.motorKeys = this.motorKeys.filter(
      (motorKey) => motorKey !== motorKeyToRemove
    );
  }

  public execute(command: ICommandSyntax, motorID: string = "") {
    this.motorKeys.forEach((motorKey) => {
      const delta = command.args?.delta || 10;
      const motor = connectedMotors.get(motorKey);
      if (!motor) {
        return;
      }
      let newMotorState;

      console.log(`RemoteInstance: Executing ${command.name} with ${delta}`);
      console.log("...and motorID: ", motorID);
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
          console.log(`${motorKey} === ${motorID}`, motorKey === motorID);
          if (motorKey === motorID) {
            motor.changeDirection();
            newMotorState = motor.getDeviceData().state;
          }
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
