import WebSocket, { WebSocketServer } from "ws";
import { IMessageForClient, IMessageForServer } from "./EventPipeline/Message";

class WSServer {
  private port: number;
  private server: WebSocket.Server<WebSocket.WebSocket>;
  private subscriptions: Array<
    (message: IMessageForServer, socket: WebSocket.WebSocket) => void
  >;
  private static instance: WSServer;
  private serverMessenger: (message: IMessageForClient) => void = () =>
    console.log("Not instantiated!");

  private constructor(port: number) {
    this.port = port;
    this.subscriptions = [];
    return this;
  }

  private setup() {
    this.server = new WebSocketServer({ port: this.port });
    this.server.on("connection", (socket) => {
      socket.on("message", (message) => {
        const modifiedMessage: any = message;
        this.subscriptions.forEach((subscription) =>
          subscription(modifiedMessage, socket)
        );
      });

      this.serverMessenger = (message: IMessageForClient) => {
        this.server.clients.forEach((client) => {
          client.send(JSON.stringify(message));
        });
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

  public static getInstance() {
    return WSServer.instance;
  }

  public static create(port?: number) {
    if (!WSServer.instance) {
      if (!port) port = 8080;
      WSServer.instance = new WSServer(port).setup();
    }
    return WSServer.getInstance();
  }

  public sendToClient(message: IMessageForClient) {
    this.serverMessenger(message);
    return this;
  }

  public addClientListener(
    callback: (message: IMessageForServer, socket: WebSocket.WebSocket) => void
  ) {
    this.subscriptions.push((message: any, socket: WebSocket.WebSocket) => {
      const decoded: IMessageForServer = JSON.parse(message);
      callback(decoded, socket);
    });
    return this;
  }
}

export default WSServer;
