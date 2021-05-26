import { makeAutoObservable } from "mobx";

export class ToQuestionnaireShuttle {
  static readonly empty = new ToQuestionnaireShuttle();
  static fromQuerystring(
    search: URLSearchParams
  ): ToQuestionnaireShuttle | undefined {
    const shuttle = new ToQuestionnaireShuttle();
    return shuttle;
  }

  public id: string = "";

  constructor(questionnaireId: string = "") {
    this.id = questionnaireId;
    makeAutoObservable(this);
  }
}
