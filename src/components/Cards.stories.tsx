import React, { PropsWithChildren } from "react";
import { Story, Meta } from "@storybook/react";
import Cards, { CardsProps } from "./Cards";

export default {
  title: "Complex/Cards",
  component: Cards,
} as Meta;

const Template: Story<PropsWithChildren<CardsProps>> = (args) => <Cards {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: "Click me",
};