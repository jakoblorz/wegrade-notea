export interface UserUpdateRequest
  extends Pick<Partial<UserAttributes>, "firstName" | "lastName"> {}

export default interface UserAttributes {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string; // nullable
  strategy: "local" | string; // nullable
  strategyId?: string; // nullable, unique
  secret: string;
  lastActiveAt: Date;
  lastActiveIp?: string; // nullable
  lastSignedInAt: Date;
  lastSignedInIp?: string; // nullable
  lastSigninEmailSentAt: Date;
  suspendedAt?: Date; // nullable
  suspendedById?: string; // nullable
}

export interface UserPresentable
  extends Omit<
    UserAttributes,
    | "email"
    | "strategy"
    | "strategyId"
    | "secret"
    | "lastActiveIp"
    | "lastSignedInAt"
    | "lastSignedInIp"
    | "lastSigninEmailSentAt"
    | "suspendedAt"
    | "suspendedById"
  > {}

export interface AccountPresentable
  extends Omit<UserAttributes, "strategyId" | "secret"> {}
