import QuestionnaireAttributes from "./QuestionnaireAttributes";

export interface TemplateUpdateRequest
  extends Pick<Partial<TemplateAttributes>, "name" | "description"> {}

export interface TemplateCreateRequest
  extends Pick<TemplateAttributes, "name" | "description"> {
  forkId?: string;
}

export interface TemplateCopyRequest
  extends Pick<Partial<TemplateAttributes>, "name" | "description"> {
  copyToProjectId?: string;
}

export default interface TemplateAttributes
  extends Omit<QuestionnaireAttributes, "projectId"> {}

export interface TemplatePresentable extends TemplateAttributes {}
