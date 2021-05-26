import { RecursiveGroupAttributes } from "./GroupAttributes";
import QuestionAttributes from "./QuestionAttributes";

export interface QuestionnaireUpdateRequest
  extends Pick<Partial<QuestionnaireAttributes>, "name" | "description"> {}

export interface QuestionnaireCreateRequest
  extends Pick<QuestionnaireAttributes, "name" | "description" | "projectId"> {
  forkId?: string;
}

export interface QuestionnaireCopyRequest
  extends Pick<Partial<QuestionnaireAttributes>, "name" | "description"> {
  copyToProjectId?: string;
}

export default interface QuestionnaireAttributes {
  id: string;
  name: string;
  forkId: string;
  description: string;
  projectId: string; // not null -> Object is in fact a Questionnaire (Questionnaire = Template with association to Project)
  closed: boolean;
}

export interface HasAssessmentStartedProperties {
  locked: boolean;
}

type RecursiveQuestionnaireAttributes = QuestionnaireAttributes & {
  groups: RecursiveGroupAttributes[];
  questions: QuestionAttributes[];
};

export interface QuestionnairePresentable extends QuestionnaireAttributes {}
