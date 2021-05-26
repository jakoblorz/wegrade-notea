import Group from "../models/Group";
import { GroupPresentable } from "../../shared/GroupAttributes";

export const presentGroup = (group: Group): GroupPresentable => ({
  description: group.description,
  groupId: group.groupId,
  id: group.id,
  name: group.name,
  position: group.position,
  questionnaireId: group.questionnaireId,
});

export default presentGroup;
