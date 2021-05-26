import React, { PropsWithChildren } from "react";
import { Story, Meta } from "@storybook/react";
import MenuButton, { MenuButtonProps } from "./MenuButton";

export default {
  title: "Core/MenuButton",
  component: MenuButton,
} as Meta;

const Template: Story<PropsWithChildren<MenuButtonProps>> = (args) => <MenuButton {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  onClick: () => { },
  children: "Content",
};