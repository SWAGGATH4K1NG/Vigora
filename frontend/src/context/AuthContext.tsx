import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken } from "../config/api";

const TOKEN_KEY = "vigora_token";
const USER_KEY = "vigora_user";

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  role?: string;
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  loginUser: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  initialized: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loginUser: async () => {},
  logout: async () => {},
  initialized: false,
});

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  const loginUser = useCallback(async (token: string, userData: User) => {
    setAuthToken(token);
    setUser(userData);
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, token),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(userData)),
    ]);
  }, []);

  const logout = useCallback(async () => {
    setAuthToken(null);
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
    setUser(null);
  }, []);

  useEffect(() => {
    async function bootstrap() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        if (storedToken) {
          setAuthToken(storedToken);
        }
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.warn("Erro ao carregar sessão:", err);
      } finally {
        setInitialized(true);
      }
    }

    bootstrap();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};
