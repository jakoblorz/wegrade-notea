import { makeAutoObservable } from "mobx";
import type GroupAttributes from "../../shared/GroupAttributes";
import type { GroupPresentable } from "../../shared/GroupAttributes";
import type { ComplexQuery } from "../../shared/ApiAttributes";
import { stringify } from "querystring";
import { LimitAndOffsetQuery } from "../utils/TypeHelpers";
import QuestionRepository from "./QuestionRepository";
import { isSimpleValue } from "../utils/IsSimpleValue";

export default class GroupRepository {
  public static readonly value = new GroupRepository();

  public groups: Array<GroupPresentable> = [];
  public group: Partial<GroupPresentable> = {};

  constructor() {
    makeAutoObservable(this);
  }

  private async reloadGroup(id: string) {
    const res = await fetch(`/api/v1/group/${id}`);
    const data = await res.json();
    if (data.ok) {
      this.groups = this.groups.map((g) => (g.id === id ? data : g));
      return data;
    }
    return null;
  }

  private async processGroupCollectionResponse(
    data: any,
    query: Partial<LimitAndOffsetQuery>
  ) {
    if (data.ok && "values" in data) {
      this.groups = Object.values(
        [...this.groups, ...data.values].reduce((v, m) => {
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

  public get hasGroup() {
    return Object.keys(this.group).length > 0;
  }

  public async loadGroups(
    query: Partial<LimitAndOffsetQuery> &
      ComplexQuery<Partial<GroupAttributes>> = {}
  ) {
    let res: Response;
    if (
      Object.keys(query).filter((k) => !isSimpleValue((query as any)[k]))
        .length > 0
    ) {
      res = await fetch("/api/v1/groups/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(query),
      });
    } else {
      res = await fetch(`/api/v1/groups?${stringify(query as any)}`);
    }
    return await this.processGroupCollectionResponse(await res.json(), query);
  }

  public async loadGroup(id: string) {
    await this.reloadGroup(id);
  }

  public async selectGroup(id: string) {
    if (this.hasGroup && this.group.id !== id) {
      this.group = {};
    }

    if (!this.hasGroup) {
      this.group = this.groups.find((g) => g.id === id) || this.group;
    }

    this.group = await this.reloadGroup(id);
  }

  public async touchQuestionnaire(questionnaireId: string) {
    await this.loadGroups({ questionnaireId });
    await Promise.all(
      this.groups.map((g) =>
        g.questionnaireId === questionnaireId
          ? QuestionRepository.value.touchGroup(g.id)
          : Promise.resolve()
      )
    );
  }
}
