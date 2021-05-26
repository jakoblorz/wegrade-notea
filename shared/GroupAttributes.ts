import QuestionAttributes, { ParentType } from "./QuestionAttributes";

export interface GroupUpdateRequest
  extends Pick<Partial<GroupAttributes>, "name" | "position" | "description"> {}

export interface GroupCreateRequest
  extends Pick<
    GroupAttributes,
    "name" | "position" | "description" | "groupId"
  > {
  parentType: ParentType;
}

export default interface GroupAttributes {
  id: string;
  name: string;
  position: number;
  description: string;
  questionnaireId: string;
  groupId: string | null; // null -> cluster is root cluster
}

export interface RecursiveGroupAttributes extends GroupAttributes {
  clusters: RecursiveGroupAttributes[];
  questions: QuestionAttributes[];
}

export interface GroupPresentable extends GroupAttributes {}
