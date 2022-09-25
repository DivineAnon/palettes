import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    showSidebar: false,
    copyPaletteIndex: null,
    avatarDelId: []
}

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setShowSidebar: (state,action) => {
            state.showSidebar = action.payload;
        },
        setCopyPaletteIndex: (state,action) => {
            state.copyPaletteIndex = action.payload;
        },
        addAvatarDelId: (state,action) => {
            state.avatarDelId = [...state.avatarDelId,action.payload];
        },
        resetAvatarDelId: (state) => {
            state.avatarDelId = [];
        }
    }
})

export const {
    setShowSidebar,
    setCopyPaletteIndex,
    addAvatarDelId,
    resetAvatarDelId
} = globalSlice.actions;

export const selectShowSidebar = (state) => state.global.showSidebar;
export const selectCopyPaletteIndex = (state) => state.global.copyPaletteIndex;
export const selectAvatarDelId = (state) => state.global.avatarDelId;

export default globalSlice.reducer;