// TODO: CLEAN UP
// A Device represents physical LEGO POWERED UP hardware.
// It should implement functions that interact with the hardware.

import Train from "./Train";
import Coaster from "./Coaster";

export interface IDevice {
  setPower: (power: number) => IDeviceState;
  brake: () => IDeviceState;
  accelerate: (
    startingPower: number,
    targetPower: number,
    time: number
  ) => IDeviceState;
  changeDirection: () => IDeviceState;
}

export interface IDeviceData {
  color: any;
  direction: 1 | -1;
}

export interface IDeviceState {
  power: number;
}

export { Train, Coaster };
