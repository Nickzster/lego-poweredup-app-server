import { IMotorCommands } from "./Motor";
import { IRemote } from "./Remote";

const connectedMotors = new Map<string, IMotorCommands>();

export const addMotor = (key: string, value: IMotorCommands) => {
  connectedMotors.set(key, value);
  return value;
};

export const getMotorByID = (key: string) => {
  return connectedMotors.get(key);
};

const remotes = new Map<string, IRemote>();

export const addRemote = (key: string, value: IRemote) => {
  remotes.set(key, value);
};

export const deleteRemote = (key: string) => {
  remotes.set(key, undefined);
};

export const getRemoteByID = (key: string) => {
  return remotes.get(key);
};
