"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/AuthProvider";
import { ChangeEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Page = () => {
  const { push } = useRouter();
  const { user, SetUser } = useUser();

  useEffect(() => {
    if (user) {
      push("/");
    }
  }, [user]);

  const { Login } = useUser();
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    if (name === "email") {
      setInputValues({ ...inputValues, email: e.target.value });
    } else if (name === "password") {
      setInputValues({ ...inputValues, password: e.target.value });
    }
  };

  const handle = async () => {
    await Login(inputValues.email, inputValues.password);
    push("/");
  };

  const createAcc = () => {
    push("/create");
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center mt-30">
        <div
          className="w-13 h-13 bg-no-repeat"
          style={{
            backgroundImage: `url('Logo.svg')`,
          }}
        ></div>
        <div className="flex flex-col gap-2 mt-10">
          <Input
            className="w-75 h-9 bg-gray-100 text-sm rounded"
            placeholder="Email"
            name="email"
            onChange={(e) => {
              handleInput(e);
            }}
          />
          <Input
            className="w-75 h-9 bg-gray-100 text-sm rounded"
            placeholder="Password"
            name="password"
            onChange={(e) => {
              handleInput(e);
            }}
          />
        </div>
        <Button
          onClick={() => handle()}
          className="text-white bg-blue-400 hover:bg-blue-500  rounded-sm font-bold text-sm px-1 py-3 w-75 mt-6"
        >
          Log in
        </Button>
        <div className="flex items-center mt-6 gap-1">
          <hr className="flex-grow border-t border-gray-300 w-29.5" />
          <span className="mx-4 text-gray-700">OR</span>
          <hr className="flex-grow border-t border-gray-300 w-29.5" />
        </div>
        <div className="text-[14px] font-medium mt-5">
          Don't have an account?
        </div>
        <div
          onClick={createAcc}
          className="text-[14px] text-blue-500 font-bold cursor-pointer"
        >
          Sign up
        </div>
      </div>
    </div>
  );
};

export default Page;
