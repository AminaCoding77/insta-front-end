"use client";
import { useUser } from "@/providers/AuthProvider";
import { Heart, HomeIcon, PlusSquare, Search, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type AllPostType = {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
    bio: string;
    followers: [string];
  };
  caption: string;
  like: [string];
  images: string;
  comment: [string];
  createdAt: string;
};

const Home = () => {
  const { token, user } = useUser();
  const { push } = useRouter();
  const [AllPosts, setAllPosts] = useState<AllPostType[]>([]);
  const [profilePic, setProfilePic] = useState<string | undefined>("blank.svg");

  const BringAllPosts = async () => {
    const JSONresponse = await fetch("http://localhost:5000/allPosts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await JSONresponse.json();
    await setAllPosts(response);
  };

  useEffect(() => {
    if (!token) {
      push("/login");
    } else {
      BringAllPosts();
    }
  }, []);

  const postLike = async (postId: String) => {
    const res = await fetch(`http://localhost:5000/toggleLike/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      toast.success("Successfully processed");
      await BringAllPosts();
    } else {
      toast.error("Something went wrong with liking the post");
    }
  };

  const strangerProfile = (staId: string) => {
    push(`/profile/${staId}`);
  };

  return (
    <div>
      <div className="w-screen flex flex-col fixed top-0 bg-white">
        <div
          className="w-30 h-10 bg-no-repeat mx-4 mt-5"
          style={{ backgroundImage: "url('insta.svg')" }}
        ></div>
        <hr></hr>
      </div>
      <div className="flex flex-col gap-3 mt-15">
        {AllPosts?.map((post, index) => (
          <div key={index}>
            <div className="flex gap-2 items-center mx-4 my-2">
              <img
                className="w-9 h-9 bg-no-repeat rounded-full"
                src={profilePic}
              />
              <div
                onClick={() => {
                  strangerProfile(post.userId._id);
                }}
                className="text-[15px] font-bold"
              >
                {post?.userId?.username}
              </div>
            </div>
            <img src={post?.images?.[0]} />
            <div className="flex gap-1 ml-3 mt-1">
              <div
                onClick={() => {
                  postLike(post._id);
                }}
              >
                {post.like.includes(user!._id) ? (
                  <div className="flex gap-1">
                    <Heart color="red" fill="red" />
                    <div>{post.like.length}</div>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Heart />
                    <div className="font-bold">{post.like.length}</div>
                  </div>
                )}
              </div>
              <div
                className="w-6 h-6 bg-no-repeat"
                style={{ backgroundImage: "url('comment.svg')" }}
              ></div>
            </div>
            <div className="ml-3 text-sm font-bold mt-1">
              {post.like.length} likes
            </div>
            <div className="ml-3 mt-1">
              <div className="font-medium">
                <strong>{post.userId.username}</strong> {post.caption}
              </div>
            </div>
            <div className="ml-3 mt-1 text-sm text-slate-500 font-medium">
              View all {post.comment.length} comments
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 sticky bottom-0 bg-white">
        <hr></hr>
        <div className="flex justify-between mx-10 mb-2 mt-1">
          <HomeIcon
            onClick={() => {
              push("/");
            }}
          />
          <Search />
          <PlusSquare
            onClick={() => {
              push("/createPost");
            }}
          />
          <UserCircle
            onClick={() => {
              push("/personal");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
