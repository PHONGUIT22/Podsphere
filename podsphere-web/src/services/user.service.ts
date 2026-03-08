import {api} from "../lib/api";
import {UserDto} from "../types/auth";
 export const userService = {
    getProfile: async () => {
        const {data} = await api.get<UserDto>("/users/profile");
        return data;
    },
    updateProfile: async (profileData: Partial<UserDto>) => {
        const {data} = await api.put<UserDto>("/users/profile", profileData);
        return data;
    }
};