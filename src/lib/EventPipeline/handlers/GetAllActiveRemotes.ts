import AbstractHandler from ".";
import { IMessageForServer, messageForClientFactory } from "../Message";

class GetAllActiveRemotesHandler extends AbstractHandler {
  public handle(message: IMessageForServer) {
    if (message.type === "GET_ALL_ACTIVE_REMOTES") {
      const response = messageForClientFactory();
      return response;
    }
    return super.handle(message);
  }
}

export default GetAllActiveRemotesHandler;
