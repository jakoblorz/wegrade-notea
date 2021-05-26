import React from "react";
import { Helmet } from "react-helmet";
import { useThemeUI } from "theme-ui";
import pkg from "../../package.json";

export type HeadProps = {
  title: string;
};

export const Head: React.FC<HeadProps> = (props) => {
  const title = [pkg.name, pkg.description, props.title]
    .filter(Boolean)
    .join(" – ");

  const { theme } = useThemeUI();

  return (
    <Helmet htmlAttributes={{ lang: "en-US" }}>
      <title>{title}</title>
      <meta name="description" content={pkg.description} />
      <link rel="icon" type="image/png" href="/icon.png" />
      <link
        rel="icon"
        media="(prefers-color-scheme:dark)"
        href="/icon-dark.png"
        type="image/png"
      />
      <link rel="apple-touch-icon" type="image/png" href="/icon.png" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@jakoblorz" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={pkg.description} />
      <meta name="theme-color" content={theme.colors!.background} />
      <script
        src="https://unpkg.com/favicon-switcher@1.2.2/dist/index.js"
        crossOrigin="anonymous"
        type="application/javascript"
      />
    </Helmet>
  );
};

export default Head;
