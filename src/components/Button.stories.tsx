import React, { PropsWithChildren } from "react";
import { Story, Meta } from "@storybook/react";
import Button, { ButtonProps } from "./Button";

export default {
  title: "Core/Button",
  component: Button,
} as Meta;

const Template: Story<PropsWithChildren<ButtonProps>> = (args) => <Button {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: "Click me",
};