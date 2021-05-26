import { ToProjectShuttle } from "../shuttles/ToProjectShuttle";
import { makeAutoObservable } from "mobx";

export class ProjectController {
  static fromToProjectShuttle({ id }: ToProjectShuttle): ProjectController {
    return new ProjectController(id);
  }

  public id: string;
  public questionnaireIds: string[] = [];
  public userIds: string[] = [];

  constructor(
    projectId: string,
    questionnaireIds: string[] = [],
    userIds: string[] = []
  ) {
    this.id = projectId;
    this.questionnaireIds = questionnaireIds;
    this.userIds = userIds;
    makeAutoObservable(this);
  }
}
