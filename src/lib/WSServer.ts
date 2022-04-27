import WebSocket from "ws";

export type IngressMessageType = "EXECUTE_MOTOR_COMMAND";

export type EgressMessageType = "NEW_CONNECTION" | "DEVICE_STATE";

export interface IIngressMessage {
  type: IngressMessageType;
  id: string;
  payload: any;
}

export interface IEgressMessage {
  type: EgressMessageType;
  id: string;
  payload: any;
}

class WSServer {
  private port: number;
  private server: WebSocket.Server<WebSocket.WebSocket>;
  private subscriptions: Array<
    (message: IIngressMessage, socket: WebSocket.WebSocket) => void
  >;
  private static instance: WSServer;
  private serverMessenger: (message: IEgressMessage) => void;

  private constructor(port: number) {
    this.port = port;
    this.subscriptions = [];
    return this;
  }

  private setup() {
    this.server = new WebSocket.Server({ port: this.port });
    this.server.on("connection", (socket) => {
      socket.on("message", (message) => {
        const modifiedMessage: any = message;
        this.subscriptions.forEach((subscription) =>
          subscription(modifiedMessage, socket)
        );
      });

      this.serverMessenger = (message: IEgressMessage) => {
        socket.send(JSON.stringify(message));
      };
    });

    console.log("Server is listening to incoming connections.");
    return this;
  }

  private closeServer() {
    this.server.close();
    console.log("Server closed.");
    return this;
  }

  public static close() {
    WSServer.instance.closeServer();
  }

  public static init(port?: number) {
    if (!WSServer.instance) {
      if (!port) port = 8080;
      WSServer.instance = new WSServer(port).setup();
    }
    return WSServer.instance;
  }

  public sendToClient(message: IEgressMessage) {
    this.serverMessenger(message);
    return this;
  }

  public addClientListener(
    callback: (message: IIngressMessage, socket: WebSocket.WebSocket) => void
  ) {
    this.subscriptions.push((message: any, socket: WebSocket.WebSocket) => {
      const decoded: IIngressMessage = JSON.parse(message);
      callback(decoded, socket);
    });
    return this;
  }
}

export default WSServer;
