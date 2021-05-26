/** @jsx jsx */
import { jsx } from "theme-ui";
import React from "react";

export type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

export const Select: React.FC<SelectProps> = (props) => (
  <select
    id={props.name}
    {...props}
    sx={{
      fontFamily:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      fontSize: 16,
      p: 2,
    }}
  />
);

export default Select;
