import { connectedMotors, remotes } from "../consts";
import { IKeyValuePair } from "../CustomMap";
import { IDeviceData } from "../Motor";

type ClientEvents =
  | "EXECUTE_MOTOR_COMMAND"
  | "GET_ALL_ACTIVE_REMOTES"
  | "ROTATE_MOTOR_TO_NEW_REMOTE";

type Error = "ERROR";

export interface IMessageForServer {
  type: ClientEvents | Error;
  remoteID?: string;
  motorID?: string;
  payload: any;
}

type RemoteAggregate = IKeyValuePair<IDeviceData[]>[];

export interface IMessageForClient {
  remotes: RemoteAggregate;
  error?: {
    message: string;
  };
}

export const messageForClientFactory = (): IMessageForClient => ({
  remotes: remotes.aggregate().map((remote) => ({
    key: remote.key,
    value: remote.value.getMotorData(),
    color: remote.value.getRemoteColor(),
  })),
});

export const errorMessageForClientFactory = (
  message: string
): IMessageForClient => ({
  remotes: null,
  error: {
    message,
  },
});
