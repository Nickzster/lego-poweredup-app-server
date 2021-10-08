import { IDevice, IDeviceState } from "./Devices";

interface IConstructor {
  command: ICommandSyntax;
  device: IDevice;
}

type CommandName = "power" | "direction" | "brake" | "accelerate";

interface ICommandSyntax {
  commandName: CommandName;
  value: any;
}

class Command {
  private command: ICommandSyntax;
  private device: IDevice;
  private executed: boolean;
  private newState: IDeviceState;
  private commandToExecute(name: CommandName) {
    return !this.executed && this.command.commandName === name;
  }
  private issueAccelerateCommand() {
    if (this.commandToExecute("accelerate")) {
      const startingPower = this.command.value.startingPower;
      const targetPower = this.command.value.targetPower;
      const time = this.command.value.time;
      this.newState = this.device.accelerate(startingPower, targetPower, time);
    }
    return this;
  }
  private issuePowerCommand() {
    if (this.commandToExecute("power")) {
      this.executed = true;
      this.newState = this.device.setPower(this.command.value);
    }
    return this;
  }
  private issueDirectionCommand() {
    if (this.commandToExecute("direction")) {
      this.executed = true;
      this.newState = this.device.changeDirection();
    }
    return this;
  }
  private issueBrakeCommand() {
    if (this.commandToExecute("brake")) {
      this.executed = true;
      this.newState = this.device.brake();
    }
    return this;
  }
  private constructor(args: IConstructor) {
    this.newState = null;
    this.device = args.device;
    this.command = args.command;
    return this;
  }
  private getFinalState() {
    return this.newState;
  }
  public static execute(args: IConstructor) {
    new Command(args)
      .issueAccelerateCommand()
      .issueBrakeCommand()
      .issuePowerCommand()
      .issueDirectionCommand()
      .getFinalState();
  }
}

export default Command;
