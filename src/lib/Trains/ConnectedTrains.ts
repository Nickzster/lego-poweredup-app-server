import Train from "./Train";

class ConnectedTrains {
  private static instance: ConnectedTrains;
  private connections: Map<string, Train>;
  private constructor() {
    this.connections = new Map<string, Train>();
  }
  public static initalize() {
    if (!ConnectedTrains.instance) {
      ConnectedTrains.instance = new ConnectedTrains();
    }
    return ConnectedTrains.instance;
  }
  public addConnection(key: string, value: Train) {
    this.connections.set(key, value);
  }
  public getConnection(key: string) {
    let train = this.connections.get(key);
    if (!train) return null;
    return train;
  }
  public getAllConnections() {
    let connections: Train[] = [];
    this.connections.forEach((connection) => connections.push(connection));
    return connections;
  }
}

export default ConnectedTrains;
