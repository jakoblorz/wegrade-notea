import React, { PropsWithChildren } from "react";
import { Story, Meta } from "@storybook/react";
import Select, { SelectProps } from "./Select";

export default {
  title: "Core/Select",
  component: Select,
} as Meta;

const Template: Story<PropsWithChildren<SelectProps>> = (args) => (
  <Select {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  children: (
    <>
      <option value="test1">Test 1</option>
      <option value="test2">Test 2</option>
    </>
  ),
};
