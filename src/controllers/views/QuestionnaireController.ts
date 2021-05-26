import { ToQuestionnaireShuttle } from "../shuttles/ToQuestionnaireShuttle";
import { makeAutoObservable } from "mobx";

export class QuestionnaireController {
  static fromToQuestionnaireShuttle({
    id,
  }: ToQuestionnaireShuttle): QuestionnaireController {
    return new QuestionnaireController(id);
  }

  public id: string;
  public questionIds: string[] = [];
  public groupIds: string[] = [];

  constructor(
    questionnaireId: string,
    questionIds: string[] = [],
    groupIds: string[] = []
  ) {
    this.id = questionnaireId;
    this.questionIds = questionIds;
    this.groupIds = groupIds;
    makeAutoObservable(this);
  }
}
