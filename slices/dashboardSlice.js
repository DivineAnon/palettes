import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { GetToken } from "../lib"

const initialState = {
    palettes: {
        data: [],
        meta: {
            pagination: {
                page: 1
            }
        },
        loadingFetchMore: false,
        detail: null,
    },
    gradients: {
        data: [],
        meta: {
            pagination: {
                page: 1
            }
        },
        loadingFetchMore: false,
        detail: null
    },
    colors: {
        data: [],
        meta: {
            pagination: {
                page: 1
            }
        },
        loadingFetchMore: false,
        detail: null
    },
    projects: {
        data: [],
        meta: {
            pagination: {
                page: 1
            }
        },
        loadingFetchMore: false,
        detail: {
            project: null,
            palettes: null,
            gradients: null,
            colors: null
        }
    },
    collections: {
        data: [],
        meta: {
            pagination: {
                page: 1
            }
        },
        loadingFetchMore: false,
        detail: {
            collection: null,
            palettes: null,
            gradients: null,
            colors: null
        }
    }
}

export const fetchMorePalettesDashboard = createAsyncThunk('dashboard/fetchPalettes', async (query) => {
    const palettes = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/saves-palettes/feed?${query}`,{
        headers: {
            Authorization: `bearer ${GetToken()}`
        }
    })
    return palettes.data;
})

export const fetchMoreGradientsDashboard = createAsyncThunk('dashboard/fetchGradients', async (query) => {
    const gradients = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/saves-gradients/feed?${query}`,{
        headers: {
            Authorization: `bearer ${GetToken()}`
        }
    })
    return gradients.data;
})

export const fetchMoreColorsDashboard = createAsyncThunk('dashboard/fetchColors', async (query) => {
    const colors = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/saves-colors/feed?${query}`,{
        headers: {
            Authorization: `bearer ${GetToken()}`
        }
    })
    return colors.data;
})

export const fetchMoreProjectsDashboard = createAsyncThunk('dashboard/fetchProjects', async (query) => {
    const projects = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/projects/feed?${query}`,{
        headers: {
            Authorization: `bearer ${GetToken()}`
        }
    })
    return projects.data;
})

export const fetchMoreCollectionsDashboard = createAsyncThunk('dashboard/fetchCollections', async (query) => {
    const collections = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/collections/feed?${query}`,null,{
        headers: {
            Authorization: `bearer ${GetToken()}`
        }
    })
    return collections.data;
})

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        //palettes
        setDashboardPalettes: (state,action) => {
            state.palettes.data = action.payload.data;
            state.palettes.meta = action.payload.meta;
        },
        updateDashboardPalette: (state,action) => {
            const findIndex = state.palettes.data.findIndex(palette=>palette.id===action.payload.id);
            state.palettes.data[findIndex] = action.payload;
        },
        addDashboardPalette: (state,action) => {
            state.palettes.data = [action.payload, ...state.palettes.data];
        },
        deleteDashboardPalette: (state,action) => {
            const newPalette = state.palettes.data.filter(palette=>palette.id!==action.payload);
            state.palettes.data = newPalette;
        },
        setDetailDashboardPalette: (state,action) => {
            state.palettes.detail = action.payload;
        },
        //gradients
        setDashboardGradients: (state,action) => {
            state.gradients.data = action.payload.data;
            state.gradients.meta = action.payload.meta;
        },
        addDashboardGradient: (state,action) => {
            state.gradients.data = [action.payload,...state.gradients.data];
        },
        deleteDashboardGradient: (state,action) => {
            const newGradients = state.gradients.data.filter(gradient=>gradient.id!==action.payload);
            state.gradients.data = newGradients;
        },
        updateDashboardGradient: (state,action) => {
            const findIndex = state.gradients.data.findIndex(gradient=>gradient.id===action.payload.id);
            state.gradients.data[findIndex] = action.payload;
        },
        setDetailDashboardGradient: (state,action) => {
            state.gradients.detail = action.payload;
        },
        //colors
        setDashboardColors: (state,action) => {
            state.colors.data = action.payload.data;
            state.colors.meta = action.payload.meta;
        },
        addDashboardColor: (state,action) => {
            state.colors.data = [action.payload,...state.colors.data];
        },
        updateDashboardColor: (state,action) => {
            const findIndex = state.colors.data.findIndex(color=>color.id===action.payload.id);
            state.colors.data[findIndex] = action.payload;
        },
        deleteDashboardColor: (state,action) => {
            const newColors = state.colors.data.filter(color=>color.id!==action.payload);
            state.colors.data = newColors;
        },
        setDetailDashboardColor: (state,action) => {
            state.colors.detail = action.payload;
        },
        //projects
        setDashboardProjects: (state,action) => {
            state.projects.data = action.payload.data;
            state.projects.meta = action.payload.meta;
        },
        updateDashboardProject: (state,action) => {
            const findIndex = state.projects.data.findIndex(project=>project.id===action.payload.id);
            state.projects.data[findIndex] = action.payload;
        },
        addDashboardProject: (state,action) => {
            state.projects.data = [action.payload,...state.projects.data];
        },
        deleteDashboardProject: (state,action) => {
            const newProjects = state.projects.data.filter(project=>project.id!==action.payload);
            state.projects.data = newProjects;
        },
        setDetailDashboardProject: (state,action) => {
            state.projects.detail.project = action.payload;
        },
        setDetailDashboardProjectPalettes: (state,action) => {
            state.projects.detail.palettes = action.payload;
        },
        addDetailDashboardProjectPalettesData: (state,action) => {
            state.projects.detail.palettes.data = [action.payload,...state.projects.detail.palettes.data];
            state.projects.detail.palettes.count += 1;
        },
        removeDetailDashboardProjectPalettesData: (state,action) => {
            state.projects.detail.palettes.data = state.projects.detail.palettes.data.filter(palette=>palette.id!==action.payload);
            state.projects.detail.palettes.count -= 1;
        },
        updateDetailDashboardProjectPalettesData: (state,action) => {
            const index = state.projects.detail.palettes.data.findIndex(palette=>palette.id===action.payload.id);
            state.projects.detail.palettes.data[index] = action.payload;
        },
        setDetailDashboardProjectColors: (state,action) => {
            state.projects.detail.colors = action.payload;
        },
        addDetailDashboardProjectColorsData: (state,action) => {
            state.projects.detail.colors.data = [action.payload,...state.projects.detail.colors.data];
            state.projects.detail.colors.count += 1;
        },
        removeDetailDashboardProjectColorsData: (state,action) => {
            state.projects.detail.colors.data = state.projects.detail.colors.data.filter(color=>color.id!==action.payload);
            state.projects.detail.colors.count -= 1;
        },
        updateDetailDashboardProjectColorsData: (state,action) => {
            let index = state.projects.detail.colors.data.findIndex(color=>color.id===action.payload.id);
            state.projects.detail.colors.data[index] = action.payload;
        },
        setDetailDashboardProjectGradients: (state,action) => {
            state.projects.detail.gradients = action.payload;
        },
        addDetailDashboardProjectGradientsData: (state,action) => {
            state.projects.detail.gradients.data = [action.payload,...state.projects.detail.gradients.data];
            state.projects.detail.gradients.count += 1;
        },
        removeDetailDashboardProjectGradientsData: (state,action) => {
            state.projects.detail.gradients.data = state.projects.detail.gradients.data.filter(gradient=>gradient.id!==action.payload);
            state.projects.detail.gradients.count -= 1;
        },
        updateDetailDashboardProjectGradientsData: (state,action) => {
            const index = state.projects.detail.gradients.data.findIndex(gradient=>gradient.id===action.payload.id);
            state.projects.detail.gradients.data[index] = action.payload;
        },
        //collections
        setDashboardCollections: (state,action) => {
            state.collections.data = action.payload.data;
            state.collections.meta = action.payload.meta;
        },
        addDashboardCollection: (state,action) => {
            state.collections.data = [action.payload,...state.collections.data];
        },
        updateDashboardCollection: (state,action) => {
            const findIndex = state.collections.data.findIndex(collection=>collection.id===action.payload.id);
            state.collections.data[findIndex] = action.payload;
        },
        deleteDashboardCollection: (state,action) => {
            const newCollections = state.collections.data.filter(collection=>collection.id!==action.payload);
            state.collections.data = newCollections;
        },
        setDetailDashboardCollection: (state,action) => {
            state.collections.detail.collection = action.payload;
        },
        setDetailDashboardCollectionPalettes: (state,action) => {
            state.collections.detail.palettes = action.payload;
        },
        setDetailDashboardCollectionColors: (state,action) => {
            state.collections.detail.colors = action.payload;
        },
        addDetailDashboardCollectionColors: (state,action) => {
            state.collections.detail.colors.data = [action.payload,...state.collections.detail.colors.data];
            state.collections.detail.colors.count += 1;
        },
        removeDetailDashboardCollectionColors: (state,action) => {
            state.collections.detail.colors.data = state.collections.detail.colors.data.filter(c=>c.id!==action.payload);
            state.collections.detail.colors.count -= 1;
        },
        updateDetailDashboardCollectionColors: (state,action) => {
            const index = state.collections.detail.colors.data.findIndex(c=>c.id===action.payload.id);
            state.collections.detail.colors.data[index] = action.payload;
        },
        addDetailDashboardCollectionGradients: (state,action) => {
            state.collections.detail.gradients.data = [action.payload,...state.collections.detail.gradients.data];
            state.collections.detail.gradients.count += 1;
        },
        removeDetailDashboardCollectionGradients: (state,action) => {
            state.collections.detail.gradients.data = state.collections.detail.gradients.data.filter(g=>g.id!==action.payload);
            state.collections.detail.gradients.count -= 1;
        },
        updateDetailDashboardCollectionGradients: (state,action) => {
            const index = state.collections.detail.gradients.data.findIndex(g=>g.id===action.payload.id);
            state.collections.detail.gradients.data[index] = action.payload;
        },
        addDetailDashboardCollectionPalettes: (state,action) => {
            state.collections.detail.palettes.data = [action.payload,...state.collections.detail.palettes.data];
            state.collections.detail.palettes.count += 1;
        },
        removeDetailDashboardCollectionPalettes: (state,action) => {
            state.collections.detail.palettes.data = state.collections.detail.palettes.data.filter(p=>p.id!==action.payload);
            state.collections.detail.palettes.count -= 1;
        },
        updateDetailDashboardCollectionPalettes: (state,action) => {
            const index = state.collections.detail.palettes.data.findIndex(p=>p.id===action.payload.id);
            state.collections.detail.palettes.data[index] = action.payload;
        },
        setDetailDashboardCollectionGradients: (state,action) => {
            state.collections.detail.gradients = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchMorePalettesDashboard.pending, (state) => {
                state.palettes.loadingFetchMore = true;
            })
            .addCase(fetchMorePalettesDashboard.fulfilled, (state,action) => {
                state.palettes.data = [...state.palettes.data, ...action.payload.data];
                state.palettes.meta = action.payload.meta;
                state.palettes.loadingFetchMore = false;
            })
            .addCase(fetchMorePalettesDashboard.rejected, (state) => {
                state.palettes.loadingFetchMore = false;
            })

            .addCase(fetchMoreGradientsDashboard.pending, (state) => {
                state.gradients.loadingFetchMore = true;
            })
            .addCase(fetchMoreGradientsDashboard.fulfilled, (state,action) => {
                state.gradients.data = [...state.gradients.data, ...action.payload.data];
                state.gradients.meta = action.payload.meta;
                state.gradients.loadingFetchMore = false;
            })
            .addCase(fetchMoreGradientsDashboard.rejected, (state) => {
                state.gradients.loadingFetchMore = false;
            })

            .addCase(fetchMoreColorsDashboard.pending, (state) => {
                state.colors.loadingFetchMore = true;
            })
            .addCase(fetchMoreColorsDashboard.fulfilled, (state,action) => {
                state.colors.data = [...state.colors.data, ...action.payload.data];
                state.colors.meta = action.payload.meta;
                state.colors.loadingFetchMore = false;
            })
            .addCase(fetchMoreColorsDashboard.rejected, (state) => {
                state.colors.loadingFetchMore = false;
            })

            .addCase(fetchMoreProjectsDashboard.pending, (state) => {
                state.projects.loadingFetchMore = true;
            })
            .addCase(fetchMoreProjectsDashboard.fulfilled, (state,action) => {
                state.projects.data = [...state.projects.data, ...action.payload.data];
                state.projects.meta = action.payload.meta;
                state.projects.loadingFetchMore = false;
            })
            .addCase(fetchMoreProjectsDashboard.rejected, (state) => {
                state.projects.loadingFetchMore = false;
            })

            .addCase(fetchMoreCollectionsDashboard.pending, (state) => {
                state.collections.loadingFetchMore = true;
            })
            .addCase(fetchMoreCollectionsDashboard.fulfilled, (state,action) => {
                state.collections.data = [...state.collections.data, ...action.payload.data];
                state.collections.meta = action.payload.meta;
                state.collections.loadingFetchMore = false;
            })
            .addCase(fetchMoreCollectionsDashboard.rejected, (state) => {
                state.collections.loadingFetchMore = false;
            })
    }
})

export const { 
    setDashboardPalettes, 
    setDashboardGradients, 
    setDashboardColors, 
    setDashboardProjects, 
    setDashboardCollections, 
    updateDashboardPalette, 
    addDashboardPalette, 
    deleteDashboardPalette, 
    setDetailDashboardPalette,
    updateDashboardProject, 
    addDashboardProject, 
    deleteDashboardProject, 
    setDetailDashboardProject,
    setDetailDashboardProjectPalettes,
    addDetailDashboardProjectPalettesData,
    removeDetailDashboardProjectPalettesData,
    updateDetailDashboardProjectPalettesData,
    setDetailDashboardProjectColors,
    addDetailDashboardProjectColorsData,
    removeDetailDashboardProjectColorsData,
    updateDetailDashboardProjectColorsData,
    setDetailDashboardProjectGradients,
    addDetailDashboardProjectGradientsData,
    removeDetailDashboardProjectGradientsData,
    updateDetailDashboardProjectGradientsData,
    addDashboardColor, 
    updateDashboardColor, 
    deleteDashboardColor, 
    setDetailDashboardColor,
    addDashboardCollection, 
    updateDashboardCollection, 
    deleteDashboardCollection,
    setDetailDashboardCollection,
    setDetailDashboardCollectionPalettes,
    setDetailDashboardCollectionColors,
    setDetailDashboardCollectionGradients,
    addDashboardGradient, 
    deleteDashboardGradient, 
    updateDashboardGradient,
    setDetailDashboardGradient,
    addDetailDashboardCollectionColors,
    updateDetailDashboardCollectionColors,
    addDetailDashboardCollectionGradients,
    addDetailDashboardCollectionPalettes,
    removeDetailDashboardCollectionPalettes,
    removeDetailDashboardCollectionColors,
    removeDetailDashboardCollectionGradients,
    updateDetailDashboardCollectionGradients,
    updateDetailDashboardCollectionPalettes,
 } = dashboardSlice.actions;

export const selectDashboardPalettes = (state) => state.dashboard.palettes;
export const selectDashboardPalettesPage = (state) => state.dashboard.palettes.meta.pagination.page;
export const selectLoadingFetchMoreDashboardPalettes = (state) => state.dashboard.palettes.loadingFetchMore;
export const selectDetailDashboardPaletteData = (state) => state.dashboard.palettes.detail;
export const selectDetailDashboardPalette = (state) => state.dashboard.palettes.detail?.palette?.palette;

export const selectDashboardGradients = (state) => state.dashboard.gradients;
export const selectDashboardGradientsPage = (state) => state.dashboard.gradients.meta.pagination.page;
export const selectLoadingFetchMoreDashboardGradients = (state) => state.dashboard.gradients.loadingFetchMore;
export const selectDetailDashboardGradient = (state) => state.dashboard.gradients.detail;

export const selectDashboardColors = (state) => state.dashboard.colors;
export const selectDashboardColorsPage = (state) => state.dashboard.colors.meta.pagination.page;
export const selectLoadingFetchMoreDashboardColors = (state) => state.dashboard.colors.loadingFetchMore;
export const selectDetailDashboardColor = (state) => state.dashboard.colors.detail;

export const selectDashboardProjects = (state) => state.dashboard.projects;
export const selectDashboardProjectsPage = (state) => state.dashboard.projects.meta.pagination.page;
export const selectLoadingFetchMoreDashboardProjects = (state) => state.dashboard.projects.loadingFetchMore;
export const selectDetailDashboardProject = (state) => state.dashboard.projects.detail.project;
export const selectDetailDashboardProjectPalettes = (state) => state.dashboard.projects.detail.palettes;
export const selectDetailDashboardProjectColors = (state) => state.dashboard.projects.detail.colors;
export const selectDetailDashboardProjectGradients = (state) => state.dashboard.projects.detail.gradients;

export const selectDashboardCollections = (state) => state.dashboard.collections;
export const selectDashboardCollectionsPage = (state) => state.dashboard.collections.meta.pagination.page;
export const selectLoadingFetchMoreDashboardCollections = (state) => state.dashboard.collections.loadingFetchMore;
export const selectDetailDashboardCollection = (state) => state.dashboard.collections.detail.collection;
export const selectDetailDashboardCollectionPalettes = (state) => state.dashboard.collections.detail.palettes;
export const selectDetailDashboardCollectionColors = (state) => state.dashboard.collections.detail.colors;
export const selectDetailDashboardCollectionGradients = (state) => state.dashboard.collections.detail.gradients;

export default dashboardSlice.reducer;