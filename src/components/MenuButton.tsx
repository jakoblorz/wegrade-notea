/** @jsx jsx */
import { jsx } from "theme-ui";
import React from "react";

type BurgerProps = { size?: string };

const Burger: React.FC<BurgerProps> = ({ size = "1em" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="currentcolor"
    viewBox="0 0 24 24"
    sx={{
      display: "block",
      margin: 0,
    }}
  >
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </svg>
);

export type MenuButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  BurgerProps & {
    menuClosed: boolean;
  };

export const MenuButton: React.FC<MenuButtonProps> = ({
  menuClosed,
  ...props
}) => (
  <button
    title="Toggle Menu"
    {...props}
    sx={{
      fontFamily: "inherit",
      fontSize: 24,
      color: "inherit",
      bg: "transparent",
      width: 32,
      height: 32,
      p: 1,
      m: 0,
      border: 0,
      appearance: "none",
      display: [null, menuClosed ? null : "none"],
    }}
  >
    <Burger size={props.size} />
  </button>
);

export default MenuButton;
