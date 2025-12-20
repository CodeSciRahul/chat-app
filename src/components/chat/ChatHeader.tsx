import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ChatHeaderProps {
  selectedReceiverName: string | null;
  selectionType: "user" | "group" | null;
  isGroupMenuOpen: boolean;
  setIsGroupMenuOpen: (open: boolean) => void;
  onGroupInfoClick: () => void;
  onSettingsClick: () => void;
  onLeaveGroup: () => void;
  isAdmin: boolean
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedReceiverName,
  selectionType,
  isGroupMenuOpen,
  setIsGroupMenuOpen,
  onGroupInfoClick,
  onSettingsClick,
  onLeaveGroup,
  isAdmin
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <Button
          onClick={() => navigate("/users")}
          variant="ghostStrong"
          size="sm"
          className="block sm:hidden rounded-full p-2"
        >
          <FaArrowLeft className="text-slate-600" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {selectedReceiverName ? selectedReceiverName.charAt(0).toUpperCase() : "?"}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {selectedReceiverName || "Select a receiver"}
            </h3>
            <p className="text-sm text-slate-500">Online</p>
          </div>
          {selectionType === 'group' && (
            <div className="ml-auto">
              <Popover open={isGroupMenuOpen} onOpenChange={setIsGroupMenuOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghostStrong" size="icon">⋮</Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-1" align="end">
                  <div className="space-y-1">
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-md transition-colors"
                      onClick={onGroupInfoClick}
                    >
                      Group info
                    </button>
                    {isAdmin && <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-md transition-colors"
                      onClick={onSettingsClick}
                    >
                      Settings
                    </button>}
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      onClick={onLeaveGroup}
                    >
                      Leave group
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
