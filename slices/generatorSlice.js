import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    zenMode: false,
    isolateColor: false,
    secondaryInfo: 'Name',
    hue: 'random',
    luminosity: 'random'
}

export const generatorSlice = createSlice({
    name: 'generator',
    initialState,
    reducers: {
        setSecondaryInfo: (state,action) => {
            state.secondaryInfo = action.payload;
        },
        setIsolateColor: (state,action) => {
            state.isolateColor = action.payload;
        },
        setZenMode: (state,action) => {
            state.zenMode = action.payload;
        },
        setHue: (state,action) => {
            state.hue = action.payload;
        },
        setLuminosity: (state,action) => {
            state.luminosity = action.payload;
        }
    }
})

export const {
    setSecondaryInfo,
    setIsolateColor,
    setZenMode,
    setHue,
    setLuminosity
} = generatorSlice.actions;

export const selectSecondaryInfo = (state) => state.generator.secondaryInfo;
export const selectIsolateColor = (state) => state.generator.isolateColor;
export const selectZenMode = (state) => state.generator.zenMode;
export const selectHue = (state) => state.generator.hue;
export const selectLuminosity = (state) => state.generator.luminosity;

export default generatorSlice.reducer;