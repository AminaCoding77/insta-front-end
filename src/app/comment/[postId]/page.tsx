"use client";

import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const postId = params.postId as string;

  return (
    <div>
      <div>{postId}</div>
    </div>
  );
};

export default Page;
