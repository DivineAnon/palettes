import { createSlice } from "@reduxjs/toolkit"

const initialState = null;

export const singlePaletteSlice = createSlice({
    name: 'singlePalette',
    initialState,
    reducers: {
        setSinglePalette: (state,action) => {
            return action.payload;
        },
        updateSinglePaletteLike: (state,action) => {
            state.saveCount = action.payload.saveCount;
            state.saves = action.payload.saves;
        }
    }
})

export const { setSinglePalette, updateSinglePaletteLike } = singlePaletteSlice.actions;

//selectors
export const selectSinglePalette = (state) => state.singlePalette;

export default singlePaletteSlice.reducer;