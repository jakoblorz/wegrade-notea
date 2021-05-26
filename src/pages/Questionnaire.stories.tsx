import React, { PropsWithChildren, useEffect } from "react";
import { Story, Meta } from "@storybook/react";
import QuestionnairePage, {
  QuestionnairePageProps,
  questionnairePagePathname,
} from "./Questionnaire";
import Layout from "../components/Layout";
import {
  InjectTemporaryAccount,
  AnonymousUser,
  BoardedUser,
} from "../utils/InjectTemporaryAccount";
import {
  InjectTemporaryProjects,
  Projects,
} from "../utils/InjectTemporaryProject";
import {
  InjectTemporaryTemplates,
  Templates,
} from "../utils/InjectTemporaryTemplate";
import {
  InjectTemporaryQuestionnaires,
  Questionnaires,
} from "../utils/InjectTemporaryQuestionnaire";
import {
  InjectTemporaryQuestions,
  Questions,
} from "../utils/InjectTemporaryQuestion";
import { InjectTemporaryGroups, Groups } from "../utils/InjectTemporaryGroup";
import { shuffle } from "lodash";

export default {
  title: "Pages/Questionnaire",
  component: QuestionnairePage,
};

const Template: Story<PropsWithChildren<QuestionnairePageProps>> = ({
  children,
  ...rest
}) => {
  const questionnaire = shuffle(Questionnaires)[0];
  const questions = Questions.filter(
    (q) => q.questionnaireId === questionnaire.id
  );
  const groups = Groups.filter((g) => g.questionnaireId === questionnaire.id);
  return (
    <Layout title="QuestionnairePage">
      <InjectTemporaryProjects projects={Projects} />
      <InjectTemporaryTemplates templates={Templates} />
      <InjectTemporaryQuestionnaires questionnaires={Questionnaires} />
      <InjectTemporaryQuestions questions={Questions} />
      <InjectTemporaryGroups groups={Groups} />

      <QuestionnairePage
        {...rest}
        DEV__questionnaireId={questionnaire.id}
        DEV__questionIds={questions.map((q) => q.id)}
        DEV__groupIds={groups.map((g) => g.id)}
      />

      {children}
    </Layout>
  );
};

export const Public = Template.bind({});
Public.args = {
  children: (
    <React.Fragment>
      <InjectTemporaryAccount user={AnonymousUser} />
    </React.Fragment>
  ),
};

export const UserBoarded = Template.bind({});
UserBoarded.args = {
  children: (
    <React.Fragment>
      <InjectTemporaryAccount user={BoardedUser} />
    </React.Fragment>
  ),
};
