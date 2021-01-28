import Train from "./Trains/Train";

interface IConstructor {
  command: ICommandSyntax;
  train: Train;
}

interface ICommandSyntax {
  commandName: "power" | "direction" | "brake";
  value: number;
}

class Command {
  private command: ICommandSyntax;
  private train: Train;
  private executed: boolean;
  private scalePower(power: number) {
    let scaled = power;
    if (power > 100) scaled = 100;
    if (power < -100) scaled = -100;
    return scaled;
  }
  private issuePowerCommand() {
    if (!this.executed && this.command.commandName === "power") {
      this.executed = true;
      let scaled = this.scalePower(this.command.value);
      this.train.setPower(scaled);
    }
    return this;
  }
  private issueDirectionCommand() {
    if (!this.executed && this.command.commandName === "direction") {
      this.executed = true;
      this.train.changeDirection();
    }
    return this;
  }
  private issueBrakeCommand() {
    if (!this.executed && this.command.commandName === "brake") {
      this.executed = true;
      this.train.brake();
    }
    return this;
  }
  private finish() {
    return this.executed;
  }
  private constructor(args: IConstructor) {
    const { command, train } = args;
    const { commandName, value } = command;
    this.train = train;
    this.executed = false;
    this.command = {
      commandName,
      value,
    };
    return this;
  }

  public static execute(args: IConstructor): boolean {
    return new Command(args)
      .issuePowerCommand()
      .issueDirectionCommand()
      .issueBrakeCommand()
      .finish();
  }
}

export default Command;
