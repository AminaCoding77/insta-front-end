"use client";
import {
  createContext,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
  Dispatch,
  useEffect,
} from "react";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

type userType = {
  _id: string;
  username: string;
  fullname: string;
  userId: string;
  email: string;
  password: string;
  profilePicture: string | Blob;
  createdAt: Date;
  bio: string | null;
  followers: string | null;
  following: string | null;
};

type decodedTokenType = {
  data: userType;
};

type ContextType = {
  Login: (email: string, password: string) => Promise<void>;
  user: userType | undefined;
  token: string | null | undefined;
  SetUser: Dispatch<SetStateAction<undefined | userType>>;
  SignUp: (
    email: string,
    password: string,
    username: string,
    fullname: string
  ) => Promise<void>;
};

const AuthContext = createContext<ContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<userType>();
  const [token, setToken] = useState<string | null>();
  const { push } = useRouter();

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      const decodedToken: decodedTokenType = jwtDecode(localToken);
      setUser(decodedToken.data);
      setToken(localToken);
    }
  }, []);

  const Login = async (email: string, password: string) => {
    const userJson = await fetch(
      "https://ig-backend-1-iphc.onrender.com/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    if (userJson.ok) {
      const token = await userJson.json();
      localStorage.setItem("token", token);
      setToken(token);
      const decodedToken: decodedTokenType = jwtDecode(token);
      setUser(decodedToken.data);
      console.log("user logged in");
      toast.success("Successfully logged in");
    } else {
      toast.error("Error has been made");
      console.log("Aldaa garlaa");
    }
  };

  const SignUp = async (
    email: string,
    password: string,
    username: string,
    fullname: string
  ) => {
    const userJson = await fetch(
      "https://ig-backend-1-iphc.onrender.com/user/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          username: username,
          fullname: fullname,
        }),
      }
    );

    if (userJson.ok) {
      const res = await userJson.json();
      localStorage.setItem("token", res);
      setToken(res);
      const decodedToken: decodedTokenType = jwtDecode(res);
      setUser(decodedToken.data);
      toast.success("Successfully user created");
      console.log("user created");
      push("/");
    } else {
      toast.error("Mdkuee neg ym ni bolhoo baichla");
    }
  };

  const value = {
    Login: Login,
    user: user,
    SignUp: SignUp,
    SetUser: setUser,
    token: token,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUser = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("auth context eere bur");
  return authContext;
};
