import React, { useEffect } from "react";
import { GroupPresentable } from "../../shared/GroupAttributes";
import GroupRepository from "../repositories/GroupRepository";
import { Questionnaires } from "./InjectTemporaryQuestionnaire";

export const InjectTemporaryGroup: React.FC<{
  group: Partial<GroupPresentable>;
}> = ({ children, group }) => {
  useEffect(() => {
    const before = GroupRepository.value.group;
    GroupRepository.value.group = group;
    return () => {
      GroupRepository.value.group = before;
    };
  }, [group]);
  return <React.Fragment>{children}</React.Fragment>;
};

export const InjectTemporaryGroups: React.FC<{
  groups: Array<GroupPresentable>;
}> = ({ children, groups }) => {
  useEffect(() => {
    const before = GroupRepository.value.groups;
    GroupRepository.value.groups = groups;
    return () => {
      GroupRepository.value.groups = before;
    };
  }, [groups]);
  return <React.Fragment>{children}</React.Fragment>;
};

export const SimpleGroup: GroupPresentable = {
  description: "Simple group's description featuring **markdown**",
  id: "simple-group",
  name: "Group 1",
  position: 0,
  groupId: "",
  questionnaireId: "",
};

export const Groups: Array<GroupPresentable> = ((
  nucleus: Array<GroupPresentable>
) => [
  ...Questionnaires.reduce(
    (arr, q) => [
      ...arr,
      ...nucleus.map((n, i) => ({
        ...n,
        id: `${n.id}-${q.id}`,
        questionnaireId: q.id,
      })),
    ],
    [] as Array<GroupPresentable>
  ),
])([SimpleGroup]);
