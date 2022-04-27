import { getRemoteByID } from "./lib/maps";
import DeviceListener from "./lib/DeviceListener";
import WSServer, { IEgressMessage } from "./lib/WSServer";

const startDeviceListener = () => {
  DeviceListener.start();
};

WSServer.init().addClientListener((message, socket) => {
  if (message.type === "EXECUTE_MOTOR_COMMAND") {
    console.log("Execute Motor Command!");
    const remoteID = message.id;
    const remote = getRemoteByID(remoteID);
    const newState = remote.execute(message.payload);
    const response: IEgressMessage = {
      type: "DEVICE_STATE",
      id: remoteID,
      payload: newState,
    };
    socket.send(JSON.stringify(response));
  }
});

startDeviceListener();
