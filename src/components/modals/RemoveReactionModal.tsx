import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reaction } from "@/types";

interface RemoveReactionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedReaction: Reaction[] | null;
  selectedMessageId: string | null;
  userId: string | null;
  onRemoveReaction: (
    messageId: string,
    reactionId: string,
    setSelectedMessageId: (messageId: string | null) => void,
    setSelectedReaction: (reactions: Reaction[] | null) => void,
    setIsRemoveReactionOpen: (isRemoveReactionOpen: boolean) => void,
  ) => void;
  setSelectedMessageId: (messageId: string | null) => void;
  setSelectedReaction: (reactions: Reaction[] | null) => void;
  setIsRemoveReactionOpen: (isRemoveReactionOpen: boolean) => void;
}

export const RemoveReactionModal: React.FC<RemoveReactionModalProps> = ({
  isOpen,
  onOpenChange,
  selectedReaction,
  selectedMessageId,
  userId,
  onRemoveReaction,
  setSelectedMessageId,
  setSelectedReaction,
  setIsRemoveReactionOpen,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reactions Info</DialogTitle>
        </DialogHeader>
        {selectedReaction && selectedReaction?.map((reaction: Reaction, index: number) => (
          <div key={reaction?._id || index} className="flex justify-between gap-2">
            <span className="text-sm font-medium text-slate-800">
              {reaction?.emoji}
              by {reaction?.user?.name}
            </span>
            <span className="flex items-center gap-2">
              <p className="text-xs text-slate-500">
              {reaction?.timestamp && new Date(reaction?.timestamp).toLocaleDateString([], { 
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })} - 
                {reaction?.timestamp && new Date(reaction?.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
              {userId === reaction?.user?._id && (
                <button 
                  className="text-xs text-red-600 hover:underline" 
                  onClick={() => {
                    onRemoveReaction(
                      selectedMessageId!,
                      reaction?._id || '',
                      setSelectedMessageId,
                      setSelectedReaction,
                      setIsRemoveReactionOpen,
                    );
                  }}
                >
                  Remove
                </button>
              )}
            </span>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
};
