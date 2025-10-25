"use client";

import { useUser } from "@/providers/AuthProvider";
import { ChevronLeft, SmileIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Footer from "@/app/_components/Footer";

type CommentPostType = {
  _id: string;
  userId: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  post: {
    _id: string;
    userId: {
      _id: string;
      username: string;
      profilePicture: string;
    };
    caption: string;
    like: string[];
    images: string[];
    updatedAt: string;
    createdAt: string;
    commentIds: string[];
  };
  comment: string;
  createdAt: string;
  updatedAt: string;
};

type PostSingle = {
  _id: string;
  userId: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  caption: string;
  like: string[];
  images: string[];
  updatedAt: string;
  createdAt: string;
  commentIds: string[];
};

const Page = () => {
  const params = useParams();
  const postId = params.postId as string;
  const [post, setPost] = useState<CommentPostType[] | null>(null);
  const [input, setInput] = useState("");
  const [postSingle, setPostSingle] = useState<PostSingle>();

  const { token } = useUser();
  const { push } = useRouter();

  const bringPostComment = async () => {
    const res = await fetch(`http://localhost:5000/bringComments/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const jsonRes = await res.json();
      setPost(jsonRes);
    } else {
      toast.error("something wrong with comment recieving API");
    }
  };

  const BringPost = async () => {
    const res = await fetch(`http://localhost:5000/bringPostOnly/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const jsonRes = await res.json();
      setPostSingle(jsonRes);
    }
  };

  useEffect(() => {
    if (token) {
      bringPostComment();
      BringPost();
    }
  }, [token]);

  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const Comment = async (postId: string | undefined) => {
    const res = await fetch("http://localhost:5000/createComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        post: postId,
        comment: input,
      }),
    });

    if (res.ok) {
      toast.success("Successfully commented");
    } else {
      toast.error("Unexpected error with comment");
    }
  };

  return (
    <div>
      <div className="flex justify-between pl-7 pr-38 mt-7 items-center mb-3">
        <ChevronLeft
          color="gray"
          size="17px"
          onClick={() => {
            push("/");
          }}
        />
        <div className="text-[15px] font-bold">Comments</div>
      </div>
      <hr></hr>

      <div>
        <div className="flex my-3 mx-6 gap-4">
          <Avatar>
            <AvatarImage src={postSingle?.userId?.profilePicture} />
            <AvatarFallback>
              {postSingle?.userId?.username?.charAt(0)}
              {postSingle?.userId?.username?.charAt(1)}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">
            <strong>{postSingle?.userId?.username}</strong>{" "}
            {postSingle?.caption}
          </div>
        </div>

        <hr></hr>
        <div>
          {post?.length! > 0 ? (
            post?.map((comment) => (
              <div key={comment._id} className="flex my-3 mx-6 gap-4">
                <Avatar>
                  <AvatarImage src={comment?.userId?.profilePicture} />
                  <AvatarFallback>
                    {comment?.userId?.username.charAt(0)}
                    {comment?.userId?.username.charAt(1)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">
                  <strong>{comment?.userId?.username}</strong>{" "}
                  {comment?.comment}
                </div>
              </div>
            ))
          ) : (
            <div className="w-screen justify-center items-center flex flex-col gap-3 mt-50">
              <div className="text-[25px] font-bold">No comments yet</div>
              <div className="text-sm font-medium">Start the conversation</div>
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-11 w-screen">
        <hr></hr>
        <div className="flex justify-between p-6">
          <SmileIcon />
          <input
            value={input}
            onChange={(e) => {
              handle(e);
            }}
            placeholder="Add a comment..."
            className="text-sm w-55"
          />
          <div
            onClick={() => {
              Comment(postSingle?._id);
            }}
            className="text-sky-500 font-medium text-sm"
          >
            Comment
          </div>
        </div>
        <hr></hr>
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
