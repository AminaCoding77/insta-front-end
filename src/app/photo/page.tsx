"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Footer from "../_components/Footer";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { upload } from "@vercel/blob/client";
import { useUser } from "@/providers/AuthProvider";
import { toast } from "sonner";

const Page = () => {
  const { push } = useRouter();
  const [image, setImage] = useState<string | null | Blob>(null);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { token } = useUser();

  const handleCaption = (e: ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value);
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    const uploaded = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/uplaod",
    });

    setImage(uploaded.url);
  };

  const createPost = async () => {
    if (image) {
      const response = await fetch(
        "https://ig-backend-1-iphc.onrender.com/post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            caption: caption,
            images: image,
          }),
        }
      );

      if (response.ok) {
        push("/");
        toast.success("Successfully created!");
      } else {
        toast.error("Post couldn't proceed");
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-screen h-fit">
      <div className="w-screen flex flex-col gap-3 mt-3">
        <div className="w-screen flex px-8 gap-25">
          <X />
          <div className="font-medium">Photo library</div>
        </div>
        <hr></hr>
      </div>
      <div className="flex flex-col gap-10 mt-10">
        <div className="flex flex-col gap-5 bg-gray-100 p-5 rounded-xl">
          <div>Share your ideas by sharing images:</div>
          <Input
            className="w-70 bg-white"
            placeholder="Upload an image..."
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleImage(e);
            }}
          />
        </div>
        <div>
          <Button
            onClick={handleUpload}
            variant="secondary"
            className="w-30 text-white bg-sky-500 font-bold rounded-lg text-sm"
          >
            Upload
          </Button>
        </div>
        <div className="flex flex-col gap-5 bg-gray-100 p-5 rounded-xl">
          <div>Enter the caption of your post:</div>
          <Input
            className="w-70 bg-white"
            placeholder="Enter caption..."
            value={caption}
            onChange={(e) => {
              handleCaption(e);
            }}
          />
        </div>
        <div className="w-40 h-50 rounded">{image && <img src={image} />}</div>
        <div>
          <Button
            className="w-40 text-white bg-sky-500 font-bold rounded-lg text-sm"
            variant="secondary"
            onClick={createPost}
          >
            Post
          </Button>
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
