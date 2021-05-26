import React, { PropsWithChildren } from "react";
import { Story, Meta } from "@storybook/react";
import SplashPage, { SplashPageProps } from "./Splash";
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

export default {
  title: "Pages/Splash",
  component: SplashPage,
};

const Template: Story<PropsWithChildren<SplashPageProps>> = ({
  children,
  ...rest
}) => (
  <Layout title="SplashPage">
    <SplashPage {...rest} />
    {children}
  </Layout>
);

export const Public = Template.bind({});
Public.args = {
  children: (
    <React.Fragment>
      <InjectTemporaryAccount user={AnonymousUser}>
        <div></div>
      </InjectTemporaryAccount>
    </React.Fragment>
  ),
};

export const UserBoarded = Template.bind({});
UserBoarded.args = {
  children: (
    <React.Fragment>
      <InjectTemporaryAccount user={BoardedUser} />
      <InjectTemporaryProjects projects={Projects} />
      <InjectTemporaryTemplates templates={Templates} />
      <InjectTemporaryQuestionnaires questionnaires={Questionnaires} />
    </React.Fragment>
  ),
};
