import {useState, createContext, ReactNode, useEffect} from "react";
import {api} from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserProps = {
  id: string;
  name: string;
  email: string;
  token: string;
};
type SignInProps = {
  email: string;
  password: string;
};

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  loadingAuth: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<UserProps>({
    id: "",
    name: "",
    email: "",
    token: "",
  });
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user.name;

  useEffect(() => {
    async function getUser() {
      //Pegar os dados salvos do user
      const userInfo = await AsyncStorage.getItem("@sujeitopizzaria");
      const hasUser: UserProps = JSON.parse(userInfo || "{}");

      // Verificar se recebemos as informaçoes dele.
      if (Object.keys(hasUser).length > 0) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${hasUser.token}`;

        setUser({
          id: hasUser.id,
          name: hasUser.name,
          email: hasUser.email,
          token: hasUser.token,
        });
      }

      setLoading(false);
    }

    getUser();
  }, []);

  async function signIn({email, password}: SignInProps) {
    setLoadingAuth(true);
    try {
      const response = await api.post("/auth", {
        email,
        password,
      });

      const {id, name, token} = response.data;

      await AsyncStorage.setItem("@user", JSON.stringify(response.data));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser({id, name, email, token});
    } catch (error) {
      console.log("Erro: " + error);
    }

    setLoadingAuth(false);
  }

  async function signOut() {
    await AsyncStorage.clear().then(() => {
      setUser({
        id: "",
        name: "",
        email: "",
        token: "",
      });
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user, 
        isAuthenticated, 
        signIn, 
        loading, 
        loadingAuth,
        signOut
      }}>
      {children}
    </AuthContext.Provider>
  );
}
