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

type PropsType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedPost: AllPostType | null;
  deleteButton: () => void;
  editButton: () => void;
  caption: string;
  setCaption: Dispatch<SetStateAction<string>>;
};

export const EditPostDialog = ({
  isOpen,
  setIsOpen,
  selectedPost,
  deleteButton,
  editButton,
  caption,
  setCaption,
}: PropsType) => {
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
            <Button onClick={editButton}>Edit</Button>
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
