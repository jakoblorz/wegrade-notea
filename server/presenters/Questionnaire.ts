import Questionnaire from "../models/Questionnaire";
import { QuestionnairePresentable } from "../../shared/QuestionnaireAttributes";

export const presentQuestionnaire = (
  questionnaire: Questionnaire
): QuestionnairePresentable => ({
  closed: questionnaire.closed,
  description: questionnaire.description,
  forkId: questionnaire.forkId,
  id: questionnaire.id,
  name: questionnaire.name,
  projectId: questionnaire.projectId,
});

export default presentQuestionnaire;
