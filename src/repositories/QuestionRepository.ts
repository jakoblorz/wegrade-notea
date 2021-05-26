import { makeAutoObservable } from "mobx";
import type { QuestionPresentable } from "../../shared/QuestionAttributes";
import { stringify } from "querystring";
import { LimitAndOffsetQuery, CollectionQuery } from "../utils/TypeHelpers";
import GroupAttributes from "../../shared/GroupAttributes";
import { isSimpleValue } from "../utils/IsSimpleValue";
import { ComplexQuery } from "../../shared/ApiAttributes";

export default class QuestionRepository {
  public static readonly value = new QuestionRepository();

  public questions: Array<QuestionPresentable> = [];
  public question: Partial<QuestionPresentable> = {};

  constructor() {
    makeAutoObservable(this);
  }

  private async reloadQuestion(id: string) {
    const res = await fetch(`/api/v1/question/${id}`);
    const data = await res.json();
    if (data.ok) {
      this.questions = this.questions.map((q) => (q.id === id ? data : q));
      return data;
    }
    return null;
  }

  private async processQuestionCollectionResponse(
    data: any,
    query: Partial<LimitAndOffsetQuery>
  ) {
    if (data.ok && "values" in data) {
      this.questions = Object.values(
        [...this.questions, ...data.values].reduce((v, m) => {
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

  public get hasQuestion() {
    return Object.keys(this.question).length > 0;
  }

  public async loadQuestions(
    query: Partial<CollectionQuery<"name">> &
      ComplexQuery<Partial<GroupAttributes>> = {}
  ) {
    let res: Response;
    if (
      Object.keys(query).filter((k) => !isSimpleValue((query as any)[k]))
        .length > 0
    ) {
      res = await fetch("/api/v1/questions/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(query),
      });
    } else {
      res = await fetch(`/api/v1/questions?${stringify(query as any)}`);
    }
    return await this.processQuestionCollectionResponse(
      await res.json(),
      query
    );
  }

  public async loadQuestion(id: string) {
    await this.reloadQuestion(id);
  }

  public async selectQuestion(id: string) {
    if (this.hasQuestion && this.question.id !== id) {
      this.question = {};
    }

    if (!this.hasQuestion) {
      this.question = this.questions.find((q) => q.id === id) || this.question;
    }

    this.question = await this.reloadQuestion(id);
  }

  public async touchGroup(groupId: string) {
    await this.loadQuestions({ groupId });
  }

  public async touchQuestionnaire(questionnaireId: string) {
    await this.loadQuestions({ questionnaireId });
  }
}
