import { configureStore } from "@reduxjs/toolkit";
import popupReducer from './slices/popupSlice';
import userReducer from './slices/userSlice';
import palettesReducer from './slices/palettesSlice';
import singlePaletteReducer from './slices/singlePaletteSlice';
import dashboardReducer from './slices/dashboardSlice';
import sidebarReducer from './slices/sidebarSlice';
import gradientsReducer from './slices/gradientsSlice';
import generatorReducer from './slices/generatorSlice';
import globalReducer from './slices/globalSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        popup: popupReducer,
        palettes: palettesReducer,
        singlePalette: singlePaletteReducer,
        dashboard: dashboardReducer,
        sidebar: sidebarReducer,
        gradients: gradientsReducer,
        generator: generatorReducer,
        global: globalReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})
