import { makeAutoObservable } from "mobx";
import type UserAttributes from "../../shared/UserAttributes";
import type { UserPresentable } from "../../shared/UserAttributes";
import { stringify } from "querystring";
import { LimitAndOffsetQuery } from "../utils/TypeHelpers";
import { isSimpleValue } from "../utils/IsSimpleValue";
import { ComplexQuery } from "../../shared/ApiAttributes";

export default class UserRepository {
  public static readonly value = new UserRepository();

  public users: Array<UserPresentable> = [];
  public user: Partial<UserPresentable> = {};

  constructor() {
    makeAutoObservable(this);
  }

  private async reloadUser(id: string) {
    const res = await fetch(`/api/v1/users/${id}`);
    const data = await res.json();
    if (data.ok) {
      this.users = this.users.map((q) => (q.id === id ? data : q));
      return data;
    }
    return null;
  }

  private async processUserCollectionResponse(
    data: any,
    query: Partial<LimitAndOffsetQuery>
  ) {
    if (data.ok && "values" in data) {
      this.users = Object.values(
        [...this.users, ...data.values].reduce((v, m) => {
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

  public get hasUser() {
    return Object.keys(this.user).length > 0;
  }

  public async loadUsers(
    query: Partial<LimitAndOffsetQuery> &
      ComplexQuery<
        Partial<
          Omit<
            UserAttributes,
            | "lastActiveAt"
            | "lastSignedInAt"
            | "lastSigninEmailSentAt"
            | "suspendedAt"
          >
        >
      > = {}
  ) {
    let res: Response;
    if (
      Object.keys(query).filter((k) => !isSimpleValue((query as any)[k]))
        .length > 0
    ) {
      res = await fetch("/api/v1/users/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(query),
      });
    } else {
      res = await fetch(`/api/v1/users?${stringify(query as any)}`);
    }
    return await this.processUserCollectionResponse(await res.json(), query);
  }

  public async loadUser(id: string) {
    await this.reloadUser(id);
  }

  public async selectUser(id: string) {
    if (this.hasUser && this.user.id !== id) {
      this.user = {};
    }

    if (!this.hasUser) {
      this.user = this.users.find((q) => q.id === id) || this.user;
    }

    this.user = await this.reloadUser(id);
  }
}
