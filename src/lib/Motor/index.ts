// TODO: CLEAN UP
// A Device represents physical LEGO POWERED UP hardware.
// It should implement functions that interact with the hardware.

import Train from "./Train";

export enum COMMANDS {
  ACCELERATE = "accelerate",
  STOP = "stop",
  SET_POWER = "set_power",
  CHANGE_DIRECTION = "change_direction",
}

export interface IActiveDeviceData {
  meta: IDeviceInfo;
  state: IDeviceState;
}

export interface IDevice {
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

export { Train };
