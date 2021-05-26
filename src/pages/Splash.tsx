/** @jsx jsx */
import { jsx, Box, Flex, Heading } from "theme-ui";
import React, { useMemo } from "react";
import { SplashController } from "../controllers/views/SplashController";
import { observer } from "mobx-react";
import { ShuttleController } from "../controllers/ShuttleController";
import { ToSplashShuttle } from "../controllers/shuttles/ToSplashShuttle";
import AccountRepository from "../repositories/AccountRepository";

export interface SplashPageProps {}

export const splashPagePathname = "/";

export const SplashPageInitializer: React.FC<
  Partial<SplashPageProps>
> = observer(({ children, ...props }) => {
  const shuttle = useMemo(
    () =>
      ShuttleController.value.popShuttle<ToSplashShuttle>(splashPagePathname),
    []
  );
  const controller = useMemo(
    () =>
      shuttle
        ? SplashController.fromToSplashShuttle(shuttle)
        : new SplashController(),
    [shuttle]
  );

  return (
    <SplashPage {...props} controller={controller} shuttle={shuttle}>
      {children}
    </SplashPage>
  );
});

export default SplashPageInitializer;

export const SplashPage: React.FC<
  Partial<SplashPageProps> & {
    controller: SplashController;
    shuttle?: ToSplashShuttle;
  }
> = observer(({ controller, ...props }) => {
  const { hasUser } = AccountRepository.value;
  const loginPrompt: JSX.Element | null = hasUser ? null : <div></div>;

  return <React.Fragment>{loginPrompt}</React.Fragment>;
});
