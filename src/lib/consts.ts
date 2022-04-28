import CustomMap from "./CustomMap";
import { IMotorCommands } from "./Motor";
import { IRemote } from "./Remote";

export const connectedMotors = new CustomMap<IMotorCommands>();

export const remotes = new CustomMap<IRemote>();
