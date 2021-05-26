import React, { useEffect } from "react";
import { AccountPresentable } from "../../shared/UserAttributes";
import AccountRepository from "../repositories/AccountRepository";

export const InjectTemporaryAccount: React.FC<{
  user: Partial<AccountPresentable>;
}> = ({ children, user }) => {
  useEffect(() => {
    const before = AccountRepository.value.user;
    AccountRepository.value.user = user;
    return () => {
      AccountRepository.value.user = before;
    };
  }, [user]);
  return <React.Fragment>{children}</React.Fragment>;
};

export const AnonymousUser: Partial<AccountPresentable> = {};

export const BoardedUser: Partial<AccountPresentable> = {
  firstName: "Lorem",
  lastName: "Ipsum",
  username: "iremlopsum",
};
