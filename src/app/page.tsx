"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const Home = () => {
  const { user, SetUser } = useUser();
  const { push } = useRouter();

  useEffect(() => {
    if (!user) {
      push("/login");
    }
  }, []);

  return (
    <div>
      <div>{user?.username}</div>
    </div>
  );
};

export default Home;
