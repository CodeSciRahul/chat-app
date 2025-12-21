import {useMutation } from '@tanstack/react-query';
import { updateProfile } from '@/services/apiService';

export const useUpdateProfile = () => {
    return useMutation({
        mutationKey: ["updateProfile"],
        mutationFn: async (data: FormData) => await updateProfile(data)
    })
}