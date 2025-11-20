import { api } from "../config/api";
import { User } from "../context/AuthContext";

type BackendUser = {
  id: string;
  email: string;
  username?: string;
  role?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
  };
};

export interface RegisterPayload {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  emailOrUsername: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const mapUser = (user: BackendUser): User => ({
  id: user.id,
  email: user.email,
  username: user.username,
  role: user.role,
  profile: user.profile,
});

export const registerRequest = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const { data } = await api.post("/auth/register", payload);
  return { ...data, user: mapUser(data.user) };
};

export const loginRequest = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const { data } = await api.post("/auth/login", payload);
  return { ...data, user: mapUser(data.user) };
};
