import { makeAutoObservable } from "mobx";

export class ShuttleController {
  public static readonly value = new ShuttleController();

  private shuttles: Map<string, any[]> = new Map<string, any[]>();
  constructor() {
    makeAutoObservable(this);
  }

  public pushShuttle<T>(pathname: string, value: T) {
    let shuttleStack = this.shuttles.get(pathname);
    if (!shuttleStack) {
      shuttleStack = [value];
    } else {
      shuttleStack.push(value);
    }
  }

  public popShuttle<T>(pathname: string): T | undefined {
    return this.shuttles.get(pathname)?.pop();
  }
}
