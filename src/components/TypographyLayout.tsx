/** @jsx jsx */
import { jsx, ThemeProvider, Flex, Styled } from "theme-ui";
import React, { useState } from "react";
import { toTheme } from "@theme-ui/typography";
import GoogleFonts from "./GoogleFonts";
import Button from "./Button";
import themes from "./TypographyThemes";
import typographyThemes from "./TypographyThemes";

const themeNames: Array<keyof typeof themes> = Object.keys(themes) as any;

type ThemeSelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  name: string;
};

const ThemeSelect: React.FC<ThemeSelectProps> = (props) => (
  <div>
    <label
      htmlFor={props.name}
      sx={{
        fontSize: 16,
        mr: 2,
      }}
    >
      Theme
    </label>
    <select
      id={props.name}
      {...props}
      sx={{
        fontFamily: "system-ui, sans-serif",
        fontSize: 16,
        p: 2,
      }}
    >
      {themeNames.map((name) => (
        <option key={name} label={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  </div>
);

export type TypographyLayoutProps = {};

export const TypographyLayout: React.FC<TypographyLayoutProps> = (props) => {
  const [themeName, setTheme] = useState(themeNames[0]);

  const typographyTheme = typographyThemes[themeName];
  const theme = toTheme(typographyTheme);
  theme.styles!.h1 = {
    fontSize: [5, 5],
  };

  return (
    <div>
      <Flex
        sx={{
          alignItems: "center",
          py: 4,
        }}
      >
        <ThemeSelect
          name="theme"
          value={themeName}
          onChange={(e) => {
            setTheme(e.target.value as any);
          }}
        />
        <Button
          sx={{
            ml: 2,
          }}
          onClick={(e) => {
            const i = (themeNames.indexOf(themeName) + 1) % themeNames.length;
            setTheme(themeNames[i]);
          }}
        >
          Next
        </Button>
      </Flex>
      <ThemeProvider theme={theme}>
        <GoogleFonts />
        <Styled.root>{props.children}</Styled.root>
      </ThemeProvider>
    </div>
  );
};

export default TypographyLayout;
