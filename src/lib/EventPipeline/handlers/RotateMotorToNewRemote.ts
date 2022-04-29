import AbstractHandler from ".";
import { remotes } from "../../consts";
import { COMMANDS } from "../../Remote";
import { IMessageForServer, messageForClientFactory } from "../Message";

class RotateMotorToNewRemoteHandler extends AbstractHandler {
  public handle(message: IMessageForServer) {
    if (message.type === "ROTATE_MOTOR_TO_NEW_REMOTE") {
      const oldRemoteID = message.remoteID;
      const motorID = message.motorID;
      const oldRemoteInstance = remotes.get(oldRemoteID);
      oldRemoteInstance.execute({ name: COMMANDS.STOP });
      oldRemoteInstance.remoteMotorFromRemote(motorID);
      const remoteList = remotes.aggregateKeys();
      const oldMotorIndex = remoteList.indexOf(oldRemoteID);
      let newMotorIndex = oldMotorIndex + 1;
      if (newMotorIndex >= remoteList.length) newMotorIndex = 0;
      const newRemoteID = remoteList[newMotorIndex];
      const newRemoteInstance = remotes.get(newRemoteID);
      newRemoteInstance.execute({ name: COMMANDS.STOP });
      newRemoteInstance.addMotor(motorID);

      const response = messageForClientFactory();
      return response;
    }
    return super.handle(message);
  }
}

export default RotateMotorToNewRemoteHandler;
