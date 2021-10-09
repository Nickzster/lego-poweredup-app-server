interface IResponse {
  status: number;
  message: string;
}

interface IBody {
  power?: number;
  name?: string;
}

class Response {
  private status: number;
  private message: string;
  public constructor(
    args: IResponse = { status: 200, message: "Command issued successfully." }
  ) {
    this.status = args.status;
    this.message = args.message;
  }
  public succeed(message: string) {
    this.status = 200;
    this.message = message;
    return this;
  }
  public failed(message: string, code = 500) {
    this.status = code;
    this.message = message;
    return this;
  }
  public getStatus() {
    return this.status;
  }
  public getMessage() {
    return { message: this.message };
  }
  public build() {
    return {
      status: this.status,
      message: this.message,
    };
  }
}

export default Response;
