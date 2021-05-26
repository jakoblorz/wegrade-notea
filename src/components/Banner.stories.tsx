import React, { PropsWithChildren } from "react";
import { Story, Meta } from "@storybook/react";
import Banner from "./Banner";

export default {
  title: "Core/Banner",
  component: Banner,
} as Meta;

const Template: Story<PropsWithChildren<{}>> = (args) => <Banner {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: "Content",
};
