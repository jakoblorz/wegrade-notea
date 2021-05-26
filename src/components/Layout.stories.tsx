import React, { PropsWithChildren } from "react";
import { Story, Meta } from "@storybook/react";
import Layout, { LayoutProps } from "./Layout";

export default {
  title: "Layout",
  component: Layout,
} as Meta;

const Template: Story<PropsWithChildren<LayoutProps>> = (args) => (
  <Layout {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  children: null,
};
