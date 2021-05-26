import React, { useEffect } from "react";
import { QuestionPresentable } from "../../shared/QuestionAttributes";
import QuestionRepository from "../repositories/QuestionRepository";
import { Questionnaires } from "./InjectTemporaryQuestionnaire";
import { Groups } from "./InjectTemporaryGroup";
import { Templates } from "./InjectTemporaryTemplate";

export const InjectTemporaryQuestion: React.FC<{
  question: Partial<QuestionPresentable>;
}> = ({ children, question }) => {
  useEffect(() => {
    const before = QuestionRepository.value.question;
    QuestionRepository.value.question = question;
    return () => {
      QuestionRepository.value.question = before;
    };
  }, [question]);
  return <React.Fragment>{children}</React.Fragment>;
};

export const InjectTemporaryQuestions: React.FC<{
  questions: Array<QuestionPresentable>;
}> = ({ children, questions }) => {
  useEffect(() => {
    const before = QuestionRepository.value.questions;
    QuestionRepository.value.questions = questions;
    return () => {
      QuestionRepository.value.questions = before;
    };
  }, [questions]);
  return <React.Fragment>{children}</React.Fragment>;
};

export const PlainTextQuestion: QuestionPresentable = {
  description: "Plain text question's description featuring **markdown**",
  id: "plain-text-question",
  name: "How are you feeling today?",
  position: 0,
  type: "TEXT",
  meta: "",
};

export const Questions: Array<QuestionPresentable> = ((
  nucleus: Array<QuestionPresentable>
) => [
  ...Questionnaires.reduce(
    (arr, q) => [
      ...arr,
      ...nucleus.map((n) => ({
        ...n,
        id: `${n.id}-${q.id}`,
        questionnaireId: q.id,
      })),
      ...Groups.reduce(
        (arr, g) => [
          ...arr,
          ...nucleus.map((n) => ({
            ...n,
            id: `${n.id}-${g.id}`,
          })),
        ],
        [] as Array<QuestionPresentable>
      ),
    ],
    [] as Array<QuestionPresentable>
  ),
  ...Templates.reduce(
    (arr, q) => [
      ...arr,
      ...nucleus.map((n) => ({
        ...n,
        id: `${n.id}-${q.id}`,
        questionnaireId: q.id,
      })),
      ...Groups.reduce(
        (arr, g) => [
          ...arr,
          ...nucleus.map((n) => ({
            ...n,
            id: `${n.id}-${g.id}`,
          })),
        ],
        [] as Array<QuestionPresentable>
      ),
    ],
    [] as Array<QuestionPresentable>
  ),
])([PlainTextQuestion]);
