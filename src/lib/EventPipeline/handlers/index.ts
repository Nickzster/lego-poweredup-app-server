import { IMessageForClient, IMessageForServer } from "../Message";

export interface IHandler {
  setNext(handler: IHandler): IHandler;
  handle(message: IMessageForServer): IMessageForClient;
}

abstract class AbstractHandler implements IHandler {
  private nextHandler: IHandler;

  public setNext(handler: IHandler) {
    this.nextHandler = handler;
    return handler;
  }

  public handle(message: IMessageForServer) {
    if (this.nextHandler) {
      return this.nextHandler.handle(message);
    }

    return null;
  }
}

export default AbstractHandler;
