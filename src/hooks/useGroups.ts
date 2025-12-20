import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getGroups, 
  createGroup, 
  addGroupMember, 
  removeGroupMember, 
  getGroupDetails, 
  getGroupMembers, 
  updateGroupMemberRole, 
  leaveGroup, 
  updateGroup 
} from '@/services/apiService';
import { 
  Groups, 
  CreateGroupData, 
  AddGroupMemberParams, 
  RemoveGroupMemberParams, 
  UpdateGroupMemberRoleParams, 
  UpdateGroupParams,
  GroupMember
} from '@/types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export const useGroups = () => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const response = await getGroups();
      if (response?.data) {
        const data = response.data as { groups: Groups };
        return data.groups;
      }
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupData: CreateGroupData) => {
      return await createGroup(groupData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Group created successfully');
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("Failed to create group");
      }
    },
  });
};

// Group Details Query Hook
export const useGroupDetails = (groupId: string | null) => {
  return useQuery({
    queryKey: ["groupDetails", groupId],
    queryFn: () => getGroupDetails(groupId!),
    enabled: !!groupId,
    select: (data) => (data as any)?.data?.group || null,
  });
};

// Group Members Query Hook
export const useGroupMembers = (groupId: string | null) => {
  return useQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: () => getGroupMembers(groupId!),
    enabled: !!groupId,
    select: (data) => ((data as any)?.data?.members || []) as GroupMember[],
  });
};

// Add Group Member Mutation Hook
export const useAddGroupMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, payload }: AddGroupMemberParams) => addGroupMember(groupId, payload),
    onSuccess: (_, { groupId }) => {
      // Invalidate group members query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
      toast.success("Member added successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("Failed to add member");
      }
    },
  });
};

// Remove Group Member Mutation Hook
export const useRemoveGroupMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, memberId }: RemoveGroupMemberParams) => removeGroupMember(groupId, memberId),
    onSuccess: (_, { groupId }) => {
      // Invalidate group members query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
      toast.success("Member removed successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("Failed to remove member");
      }
    },
  });
};

// Update Group Member Role Mutation Hook
export const useUpdateGroupMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, memberId, role }: UpdateGroupMemberRoleParams) => updateGroupMemberRole(groupId, memberId, role),
    onSuccess: (_, { groupId }) => {
      // Invalidate group members query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
      toast.success("Member role updated successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("Failed to update member role");
      }
    },
  });
};

// Leave Group Mutation Hook
export const useLeaveGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => leaveGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "groupMembers" ||
          query.queryKey[0] === "chatMessages" ||
          query.queryKey[0] === "groups"
      });
      toast.success("Left group successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("Failed to leave group");
      }
    },
  });
};

// Update Group Mutation Hook
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, data }: UpdateGroupParams) => updateGroup(groupId, data),
    onSuccess: (_, { groupId }) => {
      // Invalidate group details query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["groupDetails", groupId] });
      // Also invalidate chat messages in case group name changed
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          query.queryKey[0] === "chatMessages" && 
          query.queryKey.includes(groupId)
      });
      toast.success("Group updated successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("Failed to update group");
      }
    },
  });
};
