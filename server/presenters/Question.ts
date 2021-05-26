import Question from "../models/Question";
import { QuestionPresentable } from "../../shared/QuestionAttributes";

export const presentQuestion = (question: Question): QuestionPresentable => ({
  description: question.description,
  id: question.id,
  meta: question.meta,
  name: question.name,
  position: question.position,
  type: question.type,
  groupId: question.groupId,
  questionnaireId: question.questionnaireId,
});

export default presentQuestion;
