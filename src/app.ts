import DeviceListener from "./lib/DeviceListener";
import EventPipeline from "./lib/EventPipeline";
import WSServer from "./lib/WSServer";

const startDeviceListener = () => {
  DeviceListener.start();
};

WSServer.create(8080).addClientListener((message, socket) => {
  EventPipeline.getInstance().processMessage(message);
});

startDeviceListener();
EventPipeline.create();
