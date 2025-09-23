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

type userType = {
  username: string;
  userId: string;
  email: string;
  password: string;
  profilePicture: string | null;
  createdAt: Date;
  bio: string | null;
};

type ContextType = {
  Login: (email: string, password: string) => Promise<void>;
  user: userType | undefined;
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

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const Login = async (email: string, password: string) => {
    const userJson = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (userJson.ok) {
      const user = await userJson.json();
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
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
    const userJson = await fetch("http://localhost:5000/user/create", {
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
    });

    if (userJson.ok) {
      const user = await userJson.json();
      console.log("user created");
    }
  };

  const value = {
    Login: Login,
    user: user,
    SignUp: SignUp,
    SetUser: setUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUser = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("auth context eere bur");
  return authContext;
};
