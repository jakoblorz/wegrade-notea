import { makeAutoObservable } from "mobx";

export default class SearchBarController {
  public static readonly value = new SearchBarController();

  public projectIds: Array<string> = [];
  public questionnaireIds: Array<string> = [];

  constructor() {
    makeAutoObservable(this);
  }
}
