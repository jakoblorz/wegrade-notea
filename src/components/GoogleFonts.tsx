// for development only
import React, { useEffect, useContext } from "react";
import { Context, Theme } from "theme-ui";

const parseTypographyGoogleFonts = (typography: any) => {
  const { googleFonts } = typography.options as {
    googleFonts: Array<{ name: string; styles: string[] }>;
  };
  if (!googleFonts) return null;
  const families = googleFonts
    .map(
      ({ name, styles }) => `${name.split(" ").join("+")}:${styles.join(",")}`
    )
    .join("|");
  const href = `https://fonts.googleapis.com/css?family=${families}`;
  return href;
};

type TypographyTheme = {
  theme: Theme & {
    typography: any;
  };
};

// DON'T MIND THIS HACKY SOLUTION. Deactivation of rules-of-hooks
// acceptable

export const GoogleFonts: React.FC<{}> = ({ children }) => {
  const { theme } = useContext<TypographyTheme>(
    (Context as any) as React.Context<TypographyTheme>
  );
  if (theme.typography) {
    const href = parseTypographyGoogleFonts(theme.typography);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!href) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }, [theme.typography, href]);
  }

  return <>{children}</>;
};

export default GoogleFonts;
