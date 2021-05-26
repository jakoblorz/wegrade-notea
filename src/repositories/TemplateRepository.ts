import { makeAutoObservable } from "mobx";
import { stringify } from "querystring";
import { LimitAndOffsetQuery } from "../utils/TypeHelpers";
import QuestionRepository from "./QuestionRepository";
import GroupRepository from "./GroupRepository";
import { isSimpleValue } from "../utils/IsSimpleValue";
import { ComplexQuery } from "../../shared/ApiAttributes";
import TemplateAttributes, {
  TemplatePresentable,
} from "../../shared/TemplateAttributes";

export default class TemplateRepository {
  public static readonly value = new TemplateRepository();

  public templates: Array<TemplatePresentable> = [];
  public template: Partial<TemplatePresentable> = {};

  constructor() {
    makeAutoObservable(this);
  }

  private async reloadTemplate(id: string) {
    const res = await fetch(`/api/v1/questionnaire/${id}`);
    const data = await res.json();
    if (data.ok) {
      this.templates = this.templates.map((t) => (t.id === id ? data : t));
      return data;
    }
    return null;
  }

  private async processTemplateCollectionResponse(
    data: any,
    query: Partial<LimitAndOffsetQuery>
  ) {
    if (data.ok && "values" in data) {
      this.templates = Object.values(
        [...this.templates, ...data.values].reduce((v, m) => {
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

  public get hasTemplate() {
    return Object.keys(this.template).length > 0;
  }

  public async loadTemplates(
    query: Partial<LimitAndOffsetQuery> &
      ComplexQuery<Partial<TemplateAttributes>> = {}
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
        body: JSON.stringify({
          ...query,
          projectId: {
            "==": "",
          },
        }),
      });
    } else {
      res = await fetch(
        `/api/v1/questionnaires?${stringify({
          ...query,
          projectId: "",
        } as any)}`
      );
    }
    return await this.processTemplateCollectionResponse(
      await res.json(),
      query
    );
  }

  public async loadTemplate(id: string) {
    await this.reloadTemplate(id);
  }

  public async selectTemplate(id: string) {
    if (this.hasTemplate && this.template.id !== id) {
      this.template = {};
    }

    if (!this.hasTemplate) {
      this.template = this.templates.find((t) => t.id === id) || this.template;
    }

    this.template = await this.reloadTemplate(id);
  }

  public async touchProject() {
    await this.loadTemplates();
    await Promise.all(
      this.templates.map((q) =>
        QuestionRepository.value.touchQuestionnaire(q.id)
      )
    );
    await Promise.all(
      this.templates.map((q) => GroupRepository.value.touchQuestionnaire(q.id))
    );
  }
}
