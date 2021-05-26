import React, { PropsWithChildren } from "react";
import { Story, Meta } from "@storybook/react";
import Tiles, { TilesProps } from "./Tiles";

export default {
  title: "Core/Tiles",
  component: Tiles,
} as Meta;

const Template: Story<PropsWithChildren<TilesProps>> = (args) => <Tiles {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: "Content",
}