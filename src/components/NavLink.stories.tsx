import React, { PropsWithChildren } from "react";
import { Story, Meta } from "@storybook/react";
import NavLink, { NavLinkProps } from "./NavLink";

export default {
  title: "Core/NavLink",
  component: NavLink,
} as Meta;

const Template: Story<PropsWithChildren<NavLinkProps>> = (args) => <NavLink {...args} />;

export const External = Template.bind({});
External.args = {
  href: "https://facebook.com",
  children: "Click me for facebook",
};

export const ReactRouter = Template.bind({});
ReactRouter.args = {
  href: "/show",
  children: "Click me for internal route",
};