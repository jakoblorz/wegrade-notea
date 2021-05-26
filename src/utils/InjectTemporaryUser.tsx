import React, { useEffect } from "react";
import { UserPresentable } from "../../shared/UserAttributes";
import UserRepository from "../repositories/UserRepository";

export const InjectTemporaryUser: React.FC<{
  user: Partial<UserPresentable>;
}> = ({ children, user }) => {
  useEffect(() => {
    const before = UserRepository.value.user;
    UserRepository.value.user = user;
    return () => {
      UserRepository.value.user = before;
    };
  }, [user]);
  return <React.Fragment>{children}</React.Fragment>;
};

export const InjectTemporaryUsers: React.FC<{
  users: Array<UserPresentable>;
}> = ({ children, users }) => {
  useEffect(() => {
    const before = UserRepository.value.users;
    UserRepository.value.users = users;
    return () => {
      UserRepository.value.users = before;
    };
  }, [users]);
  return <React.Fragment>{children}</React.Fragment>;
};
