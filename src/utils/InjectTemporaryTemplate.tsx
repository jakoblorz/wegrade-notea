import React, { useEffect } from "react";
import { TemplatePresentable } from "../../shared/TemplateAttributes";
import TemplateRepository from "../repositories/TemplateRepository";
import { QuestionnairePresentable } from "../../shared/QuestionnaireAttributes";

export const InjectTemporaryTemplate: React.FC<{
  template: Partial<TemplatePresentable>;
}> = ({ children, template }) => {
  useEffect(() => {
    const before = TemplateRepository.value.template;
    TemplateRepository.value.template = template;
    return () => {
      TemplateRepository.value.template = before;
    };
  }, [template]);
  return <React.Fragment>{children}</React.Fragment>;
};

export const InjectTemporaryTemplates: React.FC<{
  templates: Array<TemplatePresentable>;
}> = ({ children, templates }) => {
  useEffect(() => {
    const before = TemplateRepository.value.templates;
    TemplateRepository.value.templates = templates;
    return () => {
      TemplateRepository.value.templates = before;
    };
  }, [templates]);
  return <React.Fragment>{children}</React.Fragment>;
};

export const EmptyTemplate: QuestionnairePresentable = {
  closed: false,
  description: "An empty questionnaire's description featuring **markdown**",
  forkId: "",
  id: "empty-questionnaire",
  name: "Empty Questionnaire",
  projectId: "",
};

export const ClosedTemplate: QuestionnairePresentable = {
  closed: true,
  description: "A closed questionnaire's description featuring **markdown**",
  forkId: "",
  name: "Closed Questionnaire",
  id: "closed-questionnaire",
  projectId: "",
};

export const Templates: Array<QuestionnairePresentable> = [
  EmptyTemplate,
  ClosedTemplate,
  {
    closed: false,
    description: "A number one questionnaire's description",
    forkId: "",
    id: "number-one-questionnaire",
    name: "Number One Questionnaire",
    projectId: "",
  },
];
