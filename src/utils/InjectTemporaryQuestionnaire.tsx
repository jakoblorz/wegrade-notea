import React, { useEffect } from "react";
import { QuestionnairePresentable } from "../../shared/QuestionnaireAttributes";
import QuestionnaireRepository from "../repositories/QuestionnaireRepository";
import { Projects } from "./InjectTemporaryProject";
import {
  EmptyTemplate,
  ClosedTemplate,
  Templates,
} from "./InjectTemporaryTemplate";

export const InjectTemporaryQuestionnaire: React.FC<{
  questionnaire: Partial<QuestionnairePresentable>;
}> = ({ children, questionnaire }) => {
  useEffect(() => {
    const before = QuestionnaireRepository.value.questionnaire;
    QuestionnaireRepository.value.questionnaire = questionnaire;
    return () => {
      QuestionnaireRepository.value.questionnaire = before;
    };
  }, [questionnaire]);
  return <React.Fragment>{children}</React.Fragment>;
};

export const InjectTemporaryQuestionnaires: React.FC<{
  questionnaires: Array<QuestionnairePresentable>;
}> = ({ children, questionnaires }) => {
  useEffect(() => {
    const before = QuestionnaireRepository.value.questionnaires;
    QuestionnaireRepository.value.questionnaires = questionnaires;
    return () => {
      QuestionnaireRepository.value.questionnaires = before;
    };
  }, [questionnaires]);
  return <React.Fragment>{children}</React.Fragment>;
};

export const EmptyQuestionnaire = EmptyTemplate;

export const ClosedQuestionnaire = ClosedTemplate;

export const Questionnaires: Array<QuestionnairePresentable> = ((
  nucleus: Array<QuestionnairePresentable>
): Array<QuestionnairePresentable> =>
  Projects.reduce(
    (arr, p) =>
      p.id.indexOf("empty") !== -1
        ? arr
        : [
            ...arr,
            ...nucleus.map((n) => ({
              ...n,
              id: `${n.id}-${p.id}`,
              projectId: p.id,
            })),
          ],
    [] as Array<QuestionnairePresentable>
  ))(Templates);
