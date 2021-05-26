import { makeAutoObservable } from "mobx";

export class ToSplashShuttle {
  static readonly empty = new ToSplashShuttle();
  static fromQuerystring(search: URLSearchParams): ToSplashShuttle | undefined {
    const shuttle = new ToSplashShuttle();
    return shuttle;
  }

  constructor() {
    makeAutoObservable(this);
  }
}
