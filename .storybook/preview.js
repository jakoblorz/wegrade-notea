import { addDecorator } from "@storybook/react";
/** @jsx jsx */
import { jsx, ThemeProvider } from "theme-ui";
import theme from "../src/theme";

import { BrowserRouter as Router } from "react-router-dom";

addDecorator((storyFn) => (
  <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
));
addDecorator((storyFn) => <Router>{storyFn()}</Router>);
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "fullscreen",
};
