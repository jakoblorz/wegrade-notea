/** @jsx jsx */
/* eslint jsx-a11y/anchor-has-content: 0 */
import { jsx } from "theme-ui";
import React from "react";
import {
  NavLink as RouterNavLink,
  NavLinkProps as RouterNavLinkProps,
} from "react-router-dom";
import isAbsoluteURL from "is-absolute-url";

export type NavLinkProps = Partial<RouterNavLinkProps<unknown>> & {
  isAbsolute?: boolean;
};

const styles = {
  variant: "links.nav",
};

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  isAbsolute,
  ...props
}) => {
  const isExternal = isAbsolute || isAbsoluteURL(href || "");
  if (isExternal) {
    return <a {...props} href={href} sx={styles} />;
  }
  const to = props.to || href;
  return (
    <RouterNavLink {...props} to={to!} sx={styles} activeClassName="active" />
  );
};

export default NavLink;
