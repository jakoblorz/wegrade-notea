import { ToSplashShuttle } from "../shuttles/ToSplashShuttle";
import { makeAutoObservable } from "mobx";

export class SplashController {
  static fromToSplashShuttle({}: ToSplashShuttle): SplashController {
    return new SplashController();
  }

  constructor() {
    makeAutoObservable(this);
  }
}
