import { makeAutoObservable } from "mobx";
import type { UserPresentable } from "../../shared/UserAttributes";

export default class AccountRepository {
  public static readonly value = new AccountRepository();

  public user?: Partial<UserPresentable> = {};

  constructor() {
    makeAutoObservable(this);
  }

  public get hasUser() {
    return Object.keys(this.user || {}).length > 0;
  }
}
