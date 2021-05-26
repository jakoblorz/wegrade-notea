import React, { PropsWithChildren } from "react";
import { Story, Meta } from "@storybook/react";
import SearchBar, { SearchBarProps } from "./SearchBar";
import ProjectRepository from "../controllers/ProjectRepository";
import QuestionnaireRepository from "../controllers/QuestionnaireRepository";
import SearchBarController from "../controllers/views/SearchBarController";

export default {
  title: "Complex/SearchBar",
  component: SearchBar,
} as Meta;

const Template: Story<PropsWithChildren<SearchBarProps>> = (args) => (
  <SearchBar {...args} />
);

SearchBarController.value.projectIds = ["p1", "p2"];
SearchBarController.value.questionnaireIds = ["q1", "q2"];

export const Basic = Template.bind({});
Basic.args = {};
