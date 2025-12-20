import React, { Fragment } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { GroupDetails, GroupMember } from "@/types";
import { Separator } from '../ui/separator';

interface GroupInfoModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    groupDetails: GroupDetails | null;
    groupMembers: GroupMember[] | null;
}

export const GroupInfoModal: React.FC<GroupInfoModalProps> = ({
    isOpen,
    onOpenChange,
    groupDetails,
    groupMembers,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Group info</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                                {(groupDetails?.name || '?').charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <div className="text-base font-semibold text-slate-800">
                                {groupDetails?.name}
                            </div>
                            {groupDetails?.description && (
                                <div className="text-sm text-slate-600">
                                    {groupDetails.description}
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-slate-500">
                        created at: {groupDetails?.createdAt && new Date(groupDetails?.createdAt).toLocaleString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        })} - {groupDetails?.createdAt && new Date(groupDetails?.createdAt).toLocaleDateString([], {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">
                            Members ({groupMembers?.length || 0})
                        </h4>
                        <div className="border border-slate-200 rounded-md divide-y divide-slate-100">
                            {groupMembers?.map((m: GroupMember) => (
                                <Fragment key={m.user?._id || m._id}>
                                <div key={m.user?._id || m._id} className="flex items-center gap-3 p-3 overflow-auto">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs font-semibold">
                                        {(m.user?.name || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="text-sm font-medium text-slate-800 truncate">
                                                {m.user?.name}
                                            </div>
                                            {m.role && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                                    {m.role}
                                                </span>
                                            )}
                                        </div>
                                        {m.user?.email && (
                                            <div className="text-xs text-slate-500 truncate mb-1">
                                                {m.user.email}
                                            </div>
                                        )}
                                        {m.joinedAt && (
                                            <div className="text-xs text-slate-400">
                                                Joined {new Date(m.joinedAt).toLocaleDateString([], {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })} at {new Date(m.joinedAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Separator />
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
