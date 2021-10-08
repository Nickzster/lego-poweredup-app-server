import { IDevice } from "./Devices";

class ConnectedDevices {
  private static instance: ConnectedDevices;
  private connections: Map<string, IDevice>;
  private constructor() {
    this.connections = new Map<string, IDevice>();
  }
  public static initalize() {
    if (!ConnectedDevices.instance) {
      ConnectedDevices.instance = new ConnectedDevices();
    }
    return ConnectedDevices.instance;
  }
  public addConnection(key: string, value: IDevice) {
    this.connections.set(key, value);
  }
  public getConnection(key: string) {
    let train = this.connections.get(key);
    if (!train) return null;
    return train;
  }
  public getAllConnections() {
    let connections: IDevice[] = [];
    this.connections.forEach((connection) => connections.push(connection));
    return connections;
  }
}

export default ConnectedDevices;
