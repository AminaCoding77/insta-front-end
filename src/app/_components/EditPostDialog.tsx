import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { AllPostType } from "../page";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { toast } from "sonner";

type PropsType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedPost: AllPostType | null;
  deleteButton: () => void;
};

export const EditPostDialog = ({
  isOpen,
  setIsOpen,
  selectedPost,
  deleteButton,
}: PropsType) => {
  const { token } = useUser();
  const [caption, setCaption] = useState<string>(selectedPost?.caption!);
  const editButton = async (id: string) => {
    const res = await fetch(
      `https://ig-backend-1-iphc.onrender.com/editButton/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caption: caption,
        }),
      }
    );

    if (res.ok) {
      toast.success("successfully updated post");
    } else {
      toast.error("something wrong with updating post");
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <Input
              value={caption}
              className="text-start w-80 h-40 inline-block resize-none"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCaption(e.target.value)
              }
            />
            <DialogDescription>
              Likes: {selectedPost?.like.length}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                editButton(selectedPost?._id!);
              }}
            >
              Edit
            </Button>
            <Button onClick={deleteButton}>Delete</Button>
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
