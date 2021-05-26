import React, { useCallback, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "theme-ui";
import { TranslationProvider } from "./hooks/Translation";

import * as serviceWorker from "./serviceWorker";
import "./index.css";
import theme from "./theme";
import Layout from "./components/Layout";
import SplashPage, { splashPagePathname } from "./pages/Splash";
import QuestionnairePage, {
  questionnairePagePathname,
} from "./pages/Questionnaire";
import ProjectPage, { projectPagePathname } from "./pages/Project";

const ProviderInjector: React.FC<{ providers: React.FC[] }> = ({
  children,
  providers,
}) => {
  const Wrapper = useMemo(
    (): React.FC => ({ children }) => (
      <>
        {providers.reduce(
          (children, Provider) => (
            <Provider>{children}</Provider>
          ),
          children
        )}
      </>
    ),
    [providers]
  );
  return <Wrapper>{children}</Wrapper>;
};

ReactDOM.render(
  <React.StrictMode>
    <ProviderInjector providers={[TranslationProvider]}>
      <ThemeProvider theme={theme}>
        <Router>
          <Layout title="wegrade">
            <Switch>
              <Route path={splashPagePathname}>
                <SplashPage />
              </Route>
              <Route path={questionnairePagePathname}>
                <QuestionnairePage />
              </Route>
              <Route path={projectPagePathname}>
                <ProjectPage />
              </Route>
            </Switch>
          </Layout>
        </Router>
      </ThemeProvider>
    </ProviderInjector>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
