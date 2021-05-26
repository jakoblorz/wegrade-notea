import React, { PropsWithChildren } from "react";
import { Story, Meta } from "@storybook/react";
import TypographyLayout, { TypographyLayoutProps } from "./TypographyLayout";
import Lorem from "./lorem.mdx";

export default {
  title: "Complex/TypographyLayout",
  component: TypographyLayout,
} as Meta;

const Template: Story<PropsWithChildren<TypographyLayoutProps>> = (args) => (
  <TypographyLayout {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  children: <Lorem />,
};
