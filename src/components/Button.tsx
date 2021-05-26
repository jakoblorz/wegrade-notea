/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from "react";

export type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = (props) => (
  <button
    {...props}
    sx={{
      appearance: 'none',
      fontFamily: 'inherit',
      fontSize: 1,
      fontWeight: 'bold',
      m: 0,
      px: 2,
      py: 2,
      color: 'text',
      bg: 'muted',
      border: 0,
      borderRadius: 2,
    }}
  />
);

export default Button;
