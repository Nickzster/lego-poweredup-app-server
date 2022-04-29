import WSServer from "../WSServer";
import { IHandler } from "./handlers";
import RotateMotorToNewRemoteHandler from "./handlers/RotateMotorToNewRemote";
import ExecuteMotorCommandHandler from "./handlers/ExecuteMotorCommand";
import GetAllActiveRemotesHandler from "./handlers/GetAllActiveRemotes";
import { IMessageForClient, IMessageForServer } from "./Message";

class EventPipeline {
  private static instance: EventPipeline = new EventPipeline();
  private firstElementInChain: IHandler;

  private constructor() {
    this.setupChain();
    return this;
  }

  public static create() {
    if (!EventPipeline.instance) {
      EventPipeline.instance = new EventPipeline();
    }
    return EventPipeline.getInstance();
  }

  public static getInstance() {
    return EventPipeline.instance;
  }

  private sendResponse(message: IMessageForClient) {
    WSServer.getInstance().sendToClient(message);
  }

  public processMessage(message: IMessageForServer) {
    console.log("EventPipeline: Handling message", message);
    const response = this.firstElementInChain.handle(message);
    console.log("Response", response);
    this.sendResponse(response);
  }

  private setupChain() {
    const rotateMotorToNewRemote = new RotateMotorToNewRemoteHandler();
    const executeMotorCommandHandler = new ExecuteMotorCommandHandler();
    const getAllActiveRemotesHandler = new GetAllActiveRemotesHandler();

    rotateMotorToNewRemote
      .setNext(executeMotorCommandHandler)
      .setNext(getAllActiveRemotesHandler);

    this.firstElementInChain = rotateMotorToNewRemote;
  }
}

export default EventPipeline;
