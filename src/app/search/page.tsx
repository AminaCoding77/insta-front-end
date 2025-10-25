"use client";

import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import Footer from "../_components/Footer";

type ResultType = {
  _id: string;
  username: string;
  email: string;
  bio: string;
  fullname: string;
  followers: string[];
  following: string[];
  createdAt: string;
  profilePicture: string;
};

const Page = () => {
  const { push } = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<ResultType[]>();
  const { token } = useUser();

  const handleCancel = () => {
    setInputValue("");
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const bringResults = async () => {
    const users = await fetch(
      `http://localhost:5000/bringResults/${inputValue}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (users.ok) {
      const jsonUsers = await users.json();
      setResults(jsonUsers);
    } else {
      // toast.error("Went wrong with bringing results");
    }
  };

  useEffect(() => {
    bringResults();
  }, [inputValue]);

  const userProf = (staId: string) => {
    push(`/profile/${staId}`);
    console.log("hello");
  };

  return (
    <div>
      <div className="flex pl-7 mt-7 gap-3 items-center mb-3">
        <ChevronLeft
          color="gray"
          size="17px"
          onClick={() => {
            push("/");
          }}
        />
        <Input
          placeholder="Search option..."
          className="bg-gray-100 border-0 rounded w-65 text-sm"
          value={inputValue}
          onChange={(e) => {
            handleInput(e);
          }}
        />
        <button
          onClick={() => {
            handleCancel();
          }}
          className="text-sm font-medium"
        >
          Cancel
        </button>
      </div>
      <hr></hr>
      <div className="flex flex-col gap-3 p-5">
        {results?.map((user) => (
          <div key={user?._id}>
            <hr className="mb-3"></hr>
            <div className="flex gap-2 items-center">
              <Avatar>
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>
                  {user?.username.charAt(0)}
                  {user?.username.charAt(1)}
                </AvatarFallback>
              </Avatar>
              <div
                onClick={() => {
                  userProf(user?._id);
                }}
              >
                {user?.username}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer
        home={() => {
          push("/");
        }}
        search={() => {
          push("/search");
        }}
        plus={() => {
          push("/createPost");
        }}
        circle={() => {
          push("/personal");
        }}
      />
    </div>
  );
};

export default Page;
