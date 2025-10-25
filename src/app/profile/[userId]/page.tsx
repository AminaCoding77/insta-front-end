"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/AuthProvider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Footer from "@/app/_components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type StaType = {
  _id: string;
  userId: string;
  caption: string;
  images: string[];
};

type StaDataType = {
  username: string;
  email: string;
  bio: string;
  fullname: string;
  profilePicture: string;
  followers: string[];
  following: string[];
  createdAt: Date;
};

const Page = () => {
  const params = useParams();
  const userId = params.userId as string;
  const { token, user } = useUser();
  const [staData, setStaData] = useState<StaDataType>();
  const [staPosts, setStaPosts] = useState<StaType[]>();
  const [profilePic, setProfilePic] = useState<string | undefined>(
    "blankk.svg"
  );

  const { push } = useRouter();

  const userFollow = async () => {
    const res = await fetch(`http://localhost:5000/toggleFollow/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      toast.success("Successfully updated followers");
    } else {
      toast.error("Something went wrong w/foll");
    }
  };

  const userPost = async () => {
    const res = await fetch(`http://localhost:5000/StaPosts/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const response = await res.json();
      setStaPosts(response);
    } else {
      toast.error("Something went wrong with bring/sta/post");
    }
  };

  const userData = async () => {
    const res = await fetch(`http://localhost:5000/StaData/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const response = await res.json();
      setStaData(response);
    } else {
      toast.error("Something went wrong with bring/sta/data");
    }
  };

  useEffect(() => {
    if (userId) {
      userPost();
      userData();
    }
  }, [userId]);

  return (
    <div className="flex flex-col w-screen">
      <div>
        <div className="flex text-[13px], font-bold text-sm justify-center mt-12 mb-3">
          {staData?.username}
        </div>
        <hr></hr>
      </div>
      <div className="flex gap-6 my-5 ml-4">
        <Avatar className="w-25 h-25">
          <AvatarImage src={staData?.profilePicture} />
          <AvatarFallback className="text-[25px]">
            {staData?.username.charAt(0)}
            {staData?.username.charAt(1)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <div className="text-[18px] font-medium">{staData?.username}</div>

          <div>
            {user?.following?.includes(userId!) ? (
              <Button
                className="w-30 h-8 text-sm font-bold"
                onClick={() => {
                  userFollow();
                }}
                variant="secondary"
              >
                Unfollow
              </Button>
            ) : (
              <Button
                className="w-30 h-8 text-sm font-bold"
                onClick={() => {
                  userFollow();
                }}
                variant="secondary"
              >
                Follow
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="text-[14px] font-bold ml-4">{staData?.fullname}</div>
      <div className="mb-4">{staData?.bio}</div>
      <hr></hr>
      <div className="flex justify-between px-15 py-3">
        <div className="flex flex-col items-center">
          <div className="font-bold text-sm">{staPosts?.length}</div>
          <div className="text-sm font-medium text-gray-500">posts</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold text-sm">{staData?.followers.length}</div>
          <div className="text-sm font-medium text-gray-500">followers</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold text-sm">{staData?.following?.length}</div>
          <div className="text-sm font-medium text-gray-500">following</div>
        </div>
      </div>
      <hr></hr>
      <div className="h-150">
        <div className="flex w-screen">
          {staPosts?.length !== 0 ? (
            staPosts?.map((post, index) => (
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
                No Shared Photos
              </div>
              <div className=" font-medium w-90 text-sm text-center">
                No posts to show
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
