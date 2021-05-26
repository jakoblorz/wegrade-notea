export interface ProjectUpdateRequest
  extends Pick<Partial<ProjectAttributes>, "name" | "description" | "closed"> {}

export interface ProjectCreateRequest
  extends Pick<ProjectAttributes, "name" | "description"> {}

export interface ProjectCopyRequest
  extends Pick<Partial<ProjectAttributes>, "name" | "description" | "closed"> {}

export default interface ProjectAttributes {
  id: string;
  name: string;
  description: string;
  closed: boolean;
}

export interface ProjectPresentable extends ProjectAttributes {}
