import React, { PropsWithChildren, useEffect } from "react";
import { Story, Meta } from "@storybook/react";
import ProjectPage, { ProjectPageProps, projectPagePathname } from "./Project";
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
  title: "Pages/Project",
  component: ProjectPage,
};

const Template: Story<
  PropsWithChildren<ProjectPageProps> & {
    noQuestionnaires?: boolean;
  }
> = ({ children, noQuestionnaires = false, ...rest }) => {
  const project = shuffle(Projects)[0];
  const questionnaires = Questionnaires.filter(
    (q) => q.projectId === project.id
  );
  return (
    <Layout title="ProjectPage">
      <InjectTemporaryProjects projects={Projects} />
      <InjectTemporaryTemplates templates={Templates} />
      <InjectTemporaryQuestionnaires questionnaires={Questionnaires} />
      <InjectTemporaryQuestions questions={Questions} />
      <InjectTemporaryGroups groups={Groups} />

      <ProjectPage
        {...rest}
        DEV__projectId={project.id}
        DEV__questionnaireIds={
          noQuestionnaires ? [] : questionnaires.map((q) => q.id)
        }
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

export const NoQuestionnaires = Template.bind({});
NoQuestionnaires.args = {
  noQuestionnaires: true,
  children: (
    <React.Fragment>
      <InjectTemporaryAccount user={BoardedUser} />
    </React.Fragment>
  ),
};
