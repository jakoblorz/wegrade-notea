import { AccountPresentable } from "../../shared/UserAttributes";
import User from "../models/User";

export const presentAccount = (user: User): AccountPresentable => ({
  firstName: user.firstName,
  id: user.id,
  lastActiveAt: user.lastActiveAt,
  lastName: user.lastName,
  username: user.username,
  avatarUrl: user.avatarUrl,
  email: user.email,
  lastSignedInAt: user.lastSignedInAt,
  lastSigninEmailSentAt: user.lastSigninEmailSentAt,
  strategy: user.strategy,
  lastActiveIp: user.lastActiveIp,
  lastSignedInIp: user.lastSignedInIp,
  suspendedAt: user.suspendedAt,
  suspendedById: user.suspendedById,
});
