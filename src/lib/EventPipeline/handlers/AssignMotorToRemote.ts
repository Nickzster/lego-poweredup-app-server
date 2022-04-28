import AbstractHandler from ".";
import { IMessageForServer, messageForClientFactory } from "../Message";

class AssignMotorToRemoteHandler extends AbstractHandler {
  public handle(message: IMessageForServer) {
    if (message.type === "ASSIGN_MOTOR_TO_REMOTE") {
      const response = messageForClientFactory();
      return response;
    }
    return super.handle(message);
  }
}

export default AssignMotorToRemoteHandler;
