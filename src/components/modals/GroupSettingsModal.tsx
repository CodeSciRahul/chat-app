import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GroupMember, GroupFormData, AddUserPayload } from "@/types";

interface GroupSettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  groupMembers: GroupMember[] | null;
  updateGroupData: GroupFormData;
  setUpdateGroupData: (data: GroupFormData) => void;
  selectedReceiverId: string | null;
  onAddMember: (payload: AddUserPayload) => void;
  onRemoveMember: (groupId: string, memberId: string) => void;
  onUpdateMemberRole: (groupId: string, memberId: string, role: "admin" | "participant") => void;
  onUpdateGroup: (groupId: string, data: any) => void;
}

// Inline add member component (email or mobile)
const AddMemberInline: React.FC<{ onAdd: (payload: AddUserPayload) => void }> = ({ onAdd }) => {
  const [value, setValue] = React.useState("");
  const isEmail = value.includes('@');
  
  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Email or mobile"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
      <Button
        variant="gradient"
        size="pillSm"
        disabled={!value}
        onClick={() => {
          onAdd(isEmail ? { email: value } : { mobile: value });
          setValue("");
        }}
      >
        Add
      </Button>
    </div>
  );
};

export const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({
  isOpen,
  onOpenChange,
  groupMembers,
  updateGroupData,
  setUpdateGroupData,
  selectedReceiverId,
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole,
  onUpdateGroup,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Group settings</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
          {/* Members Management */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Members</h4>
            <div className="border border-slate-200 rounded-md divide-y divide-slate-100">
              {groupMembers?.map((m: GroupMember) => (
                <div key={m.user?._id || m._id} className="flex items-center gap-3 p-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs font-semibold">
                    {(m.user?.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">
                      {m.user?.name}
                    </div>
                    {m.user?.email && (
                      <div className="text-xs text-slate-500 truncate">
                        {m.user.email}
                      </div>
                    )}
                  </div>
                  <select
                    className="text-xs border border-slate-200 rounded-md px-2 py-1"
                    value={m.role}
                    onChange={(e) => {
                      if (!selectedReceiverId) return;
                      onUpdateMemberRole(
                        selectedReceiverId,
                        (m.user?._id || m._id),
                        e.target.value as "admin" | "participant"
                      );
                    }}
                  >
                    <option value="participant">participant</option>
                    <option value="admin">admin</option>
                  </select>
                  <button
                    className="text-xs text-red-600 hover:underline"
                    onClick={() => {
                      if (!selectedReceiverId) return;
                      onRemoveMember(selectedReceiverId, (m.user?._id || m._id));
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Member & Group Update */}
          <div className="space-y-6">
            {/* Add Member */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Add member</h4>
              <AddMemberInline onAdd={onAddMember} />
            </div>

            {/* Update Group */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Update group</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Group name"
                  value={updateGroupData.name}
                  onChange={(e) => setUpdateGroupData({ ...updateGroupData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={updateGroupData.description}
                  onChange={(e) => setUpdateGroupData({ ...updateGroupData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  rows={2}
                />

                <div>
                  <h5 className="text-xs font-semibold text-slate-600 mb-2">Group settings</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-slate-800">Private group</div>
                        <div className="text-xs text-slate-500">Only members can see this group</div>
                      </div>
                      <Switch
                        checked={updateGroupData.settings.isPrivate}
                        onChange={(checked) => setUpdateGroupData({ 
                          ...updateGroupData, 
                          settings: { ...updateGroupData.settings, isPrivate: checked } 
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-slate-800">Allow member invites</div>
                        <div className="text-xs text-slate-500">Members can invite others</div>
                      </div>
                      <Switch
                        checked={updateGroupData.settings.allowMemberInvite}
                        onChange={(checked) => setUpdateGroupData({ 
                          ...updateGroupData, 
                          settings: { ...updateGroupData.settings, allowMemberInvite: checked } 
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-slate-800">Admin only messages</div>
                        <div className="text-xs text-slate-500">Only admins can send messages</div>
                      </div>
                      <Switch
                        checked={updateGroupData.settings.adminOnlyMessages}
                        onChange={(checked) => setUpdateGroupData({ 
                          ...updateGroupData, 
                          settings: { ...updateGroupData.settings, adminOnlyMessages: checked } 
                        })}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="gradient"
                  size="pillSm"
                  disabled={!updateGroupData.name.trim()}
                  onClick={() => {
                    if (!updateGroupData.name.trim() || !selectedReceiverId) return;
                    onUpdateGroup(selectedReceiverId, {
                      name: updateGroupData.name.trim(),
                      description: updateGroupData.description || undefined,
                      settings: updateGroupData.settings
                    });
                  }}
                  className="w-full"
                >
                  Update group
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
