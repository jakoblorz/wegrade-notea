import { makeAutoObservable } from "mobx";

export class ToProjectShuttle {
  static readonly empty = new ToProjectShuttle();
  static fromQuerystring(
    search: URLSearchParams
  ): ToProjectShuttle | undefined {
    const shuttle = new ToProjectShuttle();
    return shuttle;
  }

  public id: string = "";
  public questionnaireIds: string[] = [];

  constructor(projectId: string = "", questionnaireIds: string[] = []) {
    this.id = projectId;
    this.questionnaireIds = questionnaireIds;
    makeAutoObservable(this);
  }
}
