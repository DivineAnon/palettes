import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { GetToken } from "../lib";

const initialState = {
    library: {
        data: [],
        meta: {
            pagination: {
                page: 1
            }
        },
        loadingFetch: false,
        loadingFetchMore: false,
    },
    explore: {
        data: [],
        meta: {
            pagination: {
                page: 1
            }
        },
        loadingFetch: false,
        loadingFetchMore: false,
    }
}

export const fetchSidebarExplore = createAsyncThunk('sidebar/fetchExplore', async (query) => {
    const palettesExplore = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/palettes/feed?${query}`);
    return palettesExplore.data;
})

export const fetchSidebarExploreMore = createAsyncThunk('sidebar/fetchExploreMore', async (query) => {
    const palettesExplore = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/palettes/feed?${query}`);
    return palettesExplore.data;
})

export const fetchSidebarLibrary = createAsyncThunk('sidebar/fetchLibrary', async (query) => {
    const palettesLibrary = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/saves-palettes/feed?${query}`,{
        headers: {
            Authorization: `bearer ${GetToken()}`
        }
    })
    return palettesLibrary.data;
})

export const fetchSidebarLibraryMore = createAsyncThunk('sidebar/fetchLibraryMore', async (query) => {
    const palettesLibraryMore = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/saves-palettes/feed?${query}`,{
        headers: {
            Authorization: `bearer ${GetToken()}`
        }
    })
    return palettesLibraryMore.data;
})

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        addNewPaletteLibrary: (state,action) => {
            state.library.data = [action.payload,...state.library.data];
        },
        updatePaletteLibrary: (state,action) => {
            const findIndex = state.library.data.findIndex(palette=>palette.id===action.payload.id);
            state.library.data[findIndex] = action.payload;
        },
        deletePaletteLibrary: (state,action) => {
            const newPalettes = state.library.data.filter(palette=>palette.id!==action.payload);
            state.library.data = newPalettes;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchSidebarExplore.pending, (state) => {
                state.explore.loadingFetch = true;
            })
            .addCase(fetchSidebarExplore.fulfilled, (state,action) => {
                state.explore.data = action.payload.data;
                state.explore.meta = action.payload.meta;
                state.explore.loadingFetch = false;
            })
            .addCase(fetchSidebarExplore.rejected, (state) => {
                state.explore.loadingFetch = false;
            })

            .addCase(fetchSidebarExploreMore.pending, (state) => {
                state.explore.loadingFetchMore = true;
            })
            .addCase(fetchSidebarExploreMore.fulfilled, (state,action) => {
                state.explore.data = [...state.explore.data, ...action.payload.data];
                state.explore.meta = action.payload.meta;
                state.explore.loadingFetchMore = false;
            })
            .addCase(fetchSidebarExploreMore.rejected, (state) => {
                state.explore.loadingFetchMore = false;
            })

            .addCase(fetchSidebarLibrary.pending, (state) => {
                state.library.loadingFetch = true;
            })
            .addCase(fetchSidebarLibrary.fulfilled, (state,action) => {
                state.library.data = action.payload.data;
                state.library.meta = action.payload.meta;
                state.library.loadingFetch = false;
            })
            .addCase(fetchSidebarLibrary.rejected, (state) => {
                state.library.loadingFetch = false;
            })

            .addCase(fetchSidebarLibraryMore.pending, (state) => {
                state.library.loadingFetchMore = true;
            })
            .addCase(fetchSidebarLibraryMore.fulfilled, (state,action) => {
                state.library.data = [...state.library.data, ...action.payload.data];
                state.library.meta = action.payload.meta;
                state.library.loadingFetchMore = false;
            })
            .addCase(fetchSidebarLibraryMore.rejected, (state) => {
                state.library.loadingFetchMore = false;
            })
    }
})

export const { addNewPaletteLibrary, updatePaletteLibrary, deletePaletteLibrary } = sidebarSlice.actions;

export const selectSidebarLibrary = (state) => state.sidebar.library;
export const selectLoadingSidebarLibrary = (state) => state.sidebar.library.loadingFetch;
export const selectLoadingSidebarLibraryMore = (state) => state.sidebar.library.loadingFetchMore;
export const selectSidebarLibraryPage = (state) => state.sidebar.library.meta.pagination.page;

export const selectSidebarExplore = (state) => state.sidebar.explore;
export const selectLoadingSidebarExplore = (state) => state.sidebar.explore.loadingFetch;
export const selectLoadingSidebarExploreMore = (state) => state.sidebar.explore.loadingFetchMore;
export const selectSidebarExplorePage = (state) => state.sidebar.explore.meta.pagination.page;

export default sidebarSlice.reducer;