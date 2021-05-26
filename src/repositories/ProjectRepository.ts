import { makeAutoObservable } from "mobx";
import type ProjectAttributes from "../../shared/ProjectAttributes";
import type { ProjectPresentable } from "../../shared/ProjectAttributes";
import { stringify } from "querystring";
import QuestionnaireRepository from "./QuestionnaireRepository";
import { LimitAndOffsetQuery } from "../utils/TypeHelpers";
import { isSimpleValue } from "../utils/IsSimpleValue";
import { ComplexQuery } from "../../shared/ApiAttributes";

export default class ProjectRepository {
  public static readonly value = new ProjectRepository();

  public projects: Array<ProjectPresentable> = [];
  public project: Partial<ProjectPresentable> = {};

  constructor() {
    makeAutoObservable(this);
  }

  private async reloadProject(id: string) {
    const res = await fetch(`/api/v1/project/${id}`);
    const data = await res.json();
    if (data.ok) {
      this.projects = this.projects.map((g) => (g.id === id ? data : g));
      return data;
    }
    return null;
  }

  private async processGroupCollectionResponse(
    data: any,
    query: Partial<LimitAndOffsetQuery>
  ) {
    if (data.ok && "values" in data) {
      this.projects = Object.values(
        [...this.projects, ...data.values].reduce((v, m) => {
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

  public get hasProject() {
    return Object.keys(this.project).length > 0;
  }

  public async loadProjects(
    query: Partial<LimitAndOffsetQuery> &
      ComplexQuery<Partial<ProjectAttributes>> = {}
  ) {
    let res: Response;
    if (
      Object.keys(query).filter((k) => !isSimpleValue((query as any)[k]))
        .length > 0
    ) {
      res = await fetch("/api/v1/projects/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(query),
      });
    } else {
      res = await fetch(`/api/v1/projects?${stringify(query as any)}`);
    }
    return await this.processGroupCollectionResponse(await res.json(), query);
  }

  public async loadProject(id: string) {
    await this.reloadProject(id);
  }

  public async selectProject(id: string) {
    if (this.hasProject && this.project.id !== id) {
      this.project = {};
    }

    if (!this.hasProject) {
      this.project = this.projects.find((g) => g.id === id) || this.project;
    }

    this.project = await this.reloadProject(id);
  }

  public async touchChildrenOf(projectId: string) {
    await this.loadProject(projectId);
    await Promise.all(
      this.projects.map((p) =>
        p.id === projectId
          ? QuestionnaireRepository.value.touchProject(p.id)
          : Promise.resolve()
      )
    );
  }
}
