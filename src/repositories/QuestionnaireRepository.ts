import { makeAutoObservable } from "mobx";
import type QuestionnaireAttributes from "../../shared/QuestionnaireAttributes";
import type { QuestionnairePresentable } from "../../shared/QuestionnaireAttributes";
import { stringify } from "querystring";
import QuestionRepository from "./QuestionRepository";
import GroupRepository from "./GroupRepository";
import { LimitAndOffsetQuery } from "../utils/TypeHelpers";
import { isSimpleValue } from "../utils/IsSimpleValue";
import { ComplexQuery } from "../../shared/ApiAttributes";

export default class QuestionnaireRepository {
  public static readonly value = new QuestionnaireRepository();

  public questionnaires: Array<QuestionnairePresentable> = [];
  public questionnaire: Partial<QuestionnairePresentable> = {};

  constructor() {
    makeAutoObservable(this);
  }

  private async reloadQuestionnaire(id: string) {
    const res = await fetch(`/api/v1/questionnaires/${id}`);
    const data = await res.json();
    if (data.ok) {
      this.questionnaires = this.questionnaires.map((q) =>
        q.id === id ? data : q
      );
      return data;
    }
    return null;
  }

  private async processQuestionnaireCollectionResponse(
    data: any,
    query: Partial<LimitAndOffsetQuery>
  ) {
    if (data.ok && "values" in data) {
      this.questionnaires = Object.values(
        [...this.questionnaires, ...data.values].reduce((v, m) => {
          v[m.id] = m;
          return v;
        }, {})
      );
      return {
        ...(data.pagination as {
          limit: number;
          offset: number;
          count: number;
        }),
        ids: data.values.map((v: any) => v.id),
      };
    }
    return {
      limit: query.limit,
      offset: query.offset,
      count: 0,
      ids: [],
    };
  }

  public get hasQuestionnaire() {
    return Object.keys(this.questionnaire).length > 0;
  }

  public async loadQuestionnaires(
    query: Partial<LimitAndOffsetQuery> &
      ComplexQuery<Partial<QuestionnaireAttributes>> = {}
  ) {
    let res: Response;
    if (
      Object.keys(query).filter((k) => !isSimpleValue((query as any)[k]))
        .length > 0
    ) {
      res = await fetch("/api/v1/questionnaires/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(query),
      });
    } else {
      res = await fetch(`/api/v1/questionnaires?${stringify(query as any)}`);
    }
    return await this.processQuestionnaireCollectionResponse(
      await res.json(),
      query
    );
  }

  public async loadQuestionnaire(id: string) {
    await this.reloadQuestionnaire(id);
  }

  public async selectQuestionnaire(id: string) {
    console.debug(id);
    console.debug(this.questionnaires);
    console.debug(this.questionnaire);
    if (this.hasQuestionnaire && this.questionnaire.id !== id) {
      this.questionnaire = {};
    }

    if (!this.hasQuestionnaire) {
      this.questionnaire =
        this.questionnaires.find((q) => q.id === id) || this.questionnaire;
    }

    this.questionnaire = await this.reloadQuestionnaire(id);
  }

  public async touchProject(projectId: string) {
    await this.loadQuestionnaires({ projectId });
    await Promise.all(
      this.questionnaires.map((q) =>
        q.projectId === projectId
          ? QuestionRepository.value.touchQuestionnaire(q.id)
          : Promise.resolve()
      )
    );
    await Promise.all(
      this.questionnaires.map((q) =>
        q.projectId === projectId
          ? GroupRepository.value.touchQuestionnaire(q.id)
          : Promise.resolve()
      )
    );
  }
}
