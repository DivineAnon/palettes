import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    data: [],
    meta: {
        pagination: {
            page: 1
        }
    }
}

export const gradientsSlice = createSlice({
    name: 'gradients',
    initialState,
    reducers: {
        setGradients: (state,action) => {
            return action.payload;
        },
        updateLikeGradient: (state,action) => {
            const gradient = state.data.find(gradient=>gradient.id===action.payload.id);
            if (gradient) {
                gradient.saveCount = action.payload.saveCount;
                gradient.saves = action.payload.saves;
            }
        }
    }
})

export const { setGradients, updateLikeGradient } = gradientsSlice.actions;

export const selectDataGradients = (state) => state.gradients;

export default gradientsSlice.reducer;