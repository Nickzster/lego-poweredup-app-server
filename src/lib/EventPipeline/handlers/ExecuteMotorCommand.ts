import AbstractHandler from ".";
import { connectedMotors, remotes } from "../../consts";
import {
  errorMessageForClientFactory,
  IMessageForClient,
  IMessageForServer,
  messageForClientFactory,
} from "../Message";

class ExecuteMotorCommandHandler extends AbstractHandler {
  public handle(message: IMessageForServer) {
    if (message.type === "EXECUTE_MOTOR_COMMAND") {
      const remoteID = message.remoteID;
      const remote = remotes.get(remoteID);
      if (!remote)
        return errorMessageForClientFactory("The remote does not exist!");
      remote.execute(message.payload);
      const response: IMessageForClient = messageForClientFactory();
      return response;
    }
    return super.handle(message);
  }
}

export default ExecuteMotorCommandHandler;
