// TODO: Implement Controller
// A controller issues commands on a device.
// By default, each device is associated with one controller.
// However, new controllers can be created, and 1 or more devices can be grouped under that controller.

import { IDevice } from "../Devices";
import Device from "../Devices/Device";

class Controller {
  private devices: IDevice[];
  public constructor(newDevice?: Device) {
    this.devices = [];
    if (!!newDevice) {
      this.devices.push(newDevice);
    }
    return this;
  }
  public addDevice() {}
  public removeDevice() {}
  public issueCommand(command: ICommand) {
    command.issue();
    return this;
  }
}

interface ICommand {
  issue: () => number;
}

class AccelerateCommand implements ICommand {
  private newValue: number;
  public constructor(newValue) {
    this.newValue = newValue;
    return this;
  }
  public issue() {
    return 0;
  }
}

class BrakeCommand implements ICommand {
  public constructor() {}

  public issue() {
    return 0;
  }
}

export default Controller;
