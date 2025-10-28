"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { upload } from "@vercel/blob/client";
import { useUser } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const Page = () => {
  const { push } = useRouter();
  const { token } = useUser();
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string[] | null>([
    "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
  ]);
  const [isLoading, setIsloading] = useState(false);
  const [caption, setCaption] = useState("");

  const API_Key = process.env.API_Key;

  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleCaption = (e: ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value);
  };

  const Generator = async () => {
    if (!prompt.trim()) return;

    setIsloading(true);

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_Key}`,
      };

      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              negative_prompt: "blury, bad quality, distorted",
              num_inference_steps: 20,
              guidance_scale: 7.5,
            },
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      const file = new File([blob], "generated.png", { type: "image/png" });
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/uplaod",
      });

      if (
        imageUrl?.[0] ===
        "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
      ) {
        await setImageUrl([uploaded.url]);
      } else {
        await setImageUrl((prev) => {
          return [...prev!, uploaded.url];
        });
      }

      setIsloading(false);

      console.log(uploaded);
    } catch (error) {
      setIsloading(false);
      console.log("error error pizza");
    }
  };

  const createPost = async () => {
    const response = await fetch("http://localhost:5000/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        caption: caption,
        images: imageUrl,
      }),
    });

    if (response.ok) {
      push("/");
      toast.success("Successfully created!");
    } else {
      toast.error("Post couldn't proceed");
    }
  };
  return (
    <div className="flex flex-col mt-5 w-screen">
      <div>
        <div className="flex ml-5 gap-24 mb-4">
          <div
            className="w-5 h-5 bg-no-repeat"
            style={{ backgroundImage: `url('exit.svg')` }}
            onClick={() => {
              push("/createPost");
            }}
          ></div>
          <div className="text-[16px] font-semibold w-50">New photo post</div>
        </div>
        <hr className="flex-grow border-t border-gray-300 w-100" />
      </div>
      <div className="w-75 flex flex-col gap-1 m-4">
        <div className="text-[20px] font-bold">Explore AI generated images</div>
        <div className="text-[14px] font-semibold text-gray-500 text-sm">
          Describe what is on your mind. For best results, be specific
        </div>
      </div>
      <input
        className="text-sm border border-gray-200 w-89 h-25 rounded-sm mx-4 p-2 "
        placeholder="Example: Im walking in fog like Bladerunner 2049"
        value={prompt}
        onChange={(e) => {
          handle(e);
        }}
      />
      <button
        onClick={() => {
          Generator();
        }}
        className="text-white w-40 bg-sky-500 hover:bg-sky-600 text-[14px] font-semibold rounded-sm text-sm px-8 py-1.5 mx-4 mt-3"
      >
        Generate
      </button>
      {imageUrl?.map((url) => (
        <img src={url} key={url} className="w-90 h-120 mx-4 mt-4 rounded-sm" />
      ))}
      <Input
        className="w-90 h-15 mx-4 mt-3 text-sm"
        placeholder="Enter caption..."
        value={caption}
        onChange={(e) => {
          handleCaption(e);
        }}
      />
      <button
        onClick={() => {
          createPost();
        }}
        className="text-white w-40 bg-sky-500 hover:bg-sky-600 text-[14px] font-semibold rounded-sm text-sm px-8 py-1.5 mx-4 mt-3"
      >
        Create post
      </button>
    </div>
  );
};

export default Page;
