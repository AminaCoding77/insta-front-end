"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/AuthProvider";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { SignUp } = useUser();
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
    fullname: "",
    username: "",
  });

  const { push } = useRouter();

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    if (name === "email") {
      setInputValues({ ...inputValues, email: e.target.value });
    } else if (name === "password") {
      setInputValues({ ...inputValues, password: e.target.value });
    } else if (name === "fullname") {
      setInputValues({ ...inputValues, fullname: e.target.value });
    } else if (name === "username") {
      setInputValues({ ...inputValues, username: e.target.value });
    }
  };

  const handle = async () => {
    await SignUp(
      inputValues.email,
      inputValues.password,
      inputValues.username,
      inputValues.fullname
    );
    push("/login");
  };

  const loginPage = () => {
    push("/login");
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
        <div className="text-[16px] font-bold text-gray-500 text-center w-80 mt-6">
          Sign up to see photos and videos from your friends
        </div>
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
          <Input
            className="w-75 h-9 bg-gray-100 text-sm rounded"
            placeholder="Username"
            name="username"
            onChange={(e) => {
              handleInput(e);
            }}
          />
          <Input
            className="w-75 h-9 bg-gray-100 text-sm rounded"
            placeholder="Full Name"
            name="fullname"
            onChange={(e) => {
              handleInput(e);
            }}
          />
        </div>
        <Button
          onClick={() => handle()}
          className="text-white bg-blue-400 hover:bg-blue-500  rounded-sm font-bold text-sm px-1 py-3 w-75 mt-6"
        >
          Sign up
        </Button>
        <div className="text-[14px] font-medium mt-5">Have an account?</div>

        <div
          onClick={loginPage}
          className="text-[14px] text-blue-500 font-bold cursor-pointer"
        >
          Log in
        </div>
      </div>
    </div>
  );
};

export default Page;
