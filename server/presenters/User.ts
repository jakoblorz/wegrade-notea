import User from "../models/User";
import { UserPresentable } from "../../shared/UserAttributes";

export const presentUser = (user: User): UserPresentable => ({
  firstName: user.firstName,
  id: user.id,
  lastActiveAt: user.lastActiveAt,
  lastName: user.lastName,
  username: user.username,
  avatarUrl: user.avatarUrl,
});

export default presentUser;
