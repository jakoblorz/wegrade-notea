import React, { PropsWithChildren } from "react";
import { Story, Meta } from "@storybook/react";
import Note, { NoteProps } from "./Note";

export default {
  title: "Core/Note",
  component: Note,
} as Meta;

const Template: Story<PropsWithChildren<NoteProps>> = (args) => <Note {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: "I am important",
};