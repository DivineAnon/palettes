import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { GetToken } from "../lib";

const initialState = null;

export const fetchUser = createAsyncThunk('user/fetchUser', async (ctx) => {
    const token = GetToken(ctx);
    if (token) {
        try {
            const user = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/users-permissions/user/getMe`,{
                headers: {
                    Authorization: `bearer ${token}`
                }
            });
            return user.data;
        } catch (error) {
            return null;
        }
    }
    return null;
})

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state,action) => {
            return action.payload;
        },
        updateUserProject: (state,action) => {
            const findIndex = state.projects.data.findIndex(project=>project.id===action.payload.id);
            state.projects.data[findIndex] = action.payload;
        },
        addUserProject: (state,action) => {
            state.projects.data = [action.payload,...state.projects.data];
        },
        deleteUserProject: (state,action) => {
            const newProjects = state.projects.data.filter(project=>project.id!==action.payload);
            state.projects.data = newProjects;
        },
        addUserCollection: (state,action) => {
            state.collections.data = [action.payload,...state.collections.data];
        },
        updateUserCollection: (state,action) => {
            const findIndex = state.collections.data.findIndex(collection=>collection.id===action.payload.id);
            state.collections.data[findIndex] = action.payload;
        },
        deleteUserCollection: (state,action) => {
            const newCollections = state.collections.data.filter(collection=>collection.id!==action.payload);
            state.collections.data = newCollections;
        },
        updateAvatar: (state,action) => {
            state.avatar = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUser.fulfilled, (state,action) => {
                return action.payload;
            })
    }
})


export const { setUser, updateUserProject, addUserProject, deleteUserProject, addUserCollection, updateUserCollection, deleteUserCollection, updateAvatar } = userSlice.actions;

export const selectUser = (state) => state.user;
export const selectUserProjects = (state) => state.user?.projects;

export default userSlice.reducer;