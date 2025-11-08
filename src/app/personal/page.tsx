"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../_components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Posts = {
  _id: string;
  userId: string;
  caption: string;
  images: [string];
};

const Page = () => {
  const { user, token } = useUser();
  const [userPosts, setUserPosts] = useState<Posts[]>([]);

  const { push } = useRouter();

  const Getpost = async () => {
    const response = await fetch(
      `https://ig-backend-1-iphc.onrender.com/posts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const jsonResponse = await response.json();
    setUserPosts(jsonResponse);
  };
  useEffect(() => {
    if (token) {
      Getpost();
    }
  }, [token]);

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col w-screen h-screen">
      <div>
        <div className="flex text-[13px], font-bold text-sm justify-center mt-12 mb-3">
          {user?.username}
        </div>
        <hr></hr>
      </div>
      <div className="flex gap-6 my-5 ml-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>
            {user?.username.charAt(0)}
            {user?.username.charAt(1)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <div className="text-[18px] font-medium">{user?.username}</div>
          <Button
            className=" font-bold w-25 rounded text-[13px] h-6"
            variant={"secondary"}
          >
            Edit profile
          </Button>
        </div>
      </div>
      <div className="text-[14px] font-bold ml-4">{user?.fullname}</div>
      <div className="mb-4">{user?.bio}</div>
      <hr></hr>
      <div className="flex justify-between px-15 py-3">
        <div className="flex flex-col items-center">
          <div className="font-bold text-sm">{userPosts.length}</div>
          <div className="text-sm font-medium text-gray-500">posts</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold text-sm">{user?.followers?.length}</div>
          <div className="text-sm font-medium text-gray-500">followers</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold text-sm">{user?.following?.length}</div>
          <div className="text-sm font-medium text-gray-500">following</div>
        </div>
      </div>
      <hr></hr>
      <div>
        <div className="flex w-screen">
          {userPosts.length !== 0 ? (
            userPosts?.map((post, index) => (
              <img
                key={index}
                className="w-32 h-44 ml-0.5 mt-0.5"
                src={post?.images?.[0]}
              />
            ))
          ) : (
            <div className="flex flex-col items-center w-full">
              <div
                className="w-16 h-16 bg-no-repeat bg-center mt-10"
                style={{ backgroundImage: "url('apple.svg')" }}
              ></div>
              <div className="text-[28px] font-sans font-extrabold mt-4 mb-4">
                Share Photos
              </div>
              <div className=" font-medium w-90 text-sm text-center">
                When you share photos, they will appear on your profile.
              </div>
              <div className="text-[15px] font-bold text-sky-500 mt-5">
                Share your first photo
              </div>
            </div>
          )}
        </div>
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
