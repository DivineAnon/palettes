import { createSlice } from "@reduxjs/toolkit"
import Router from "next/router";

const initialState = {
    palettes: {
        data: [],
        meta: {
            pagination: {
                page: 1
            }
        }
    },
    queryList: { 
        query: [], 
        sort: 'Trending'
    }
}

export const paletteSlice = createSlice({
    name: 'palettes',
    initialState,
    reducers: {
        setPalettes: (state,action) => {
            state.palettes = action.payload;
        },
        updateLikePalette: (state,action) => {
            const palette = state.palettes.data.find(palette=>palette.id===action.payload.id);
            if (palette) {
                palette.saveCount = action.payload.saveCount;
                palette.saves = action.payload.saves;
            }
        },
        updateDataPalettes: (state,action) => {
            state.palettes.data = action.payload;
        },
        setQueryList: (state,action) => {
            state.queryList = action.payload;
        },
        handleAddQuery: (state,action) => {
            const { type, data, value, replace, sort } = action.payload;
            if (Router.route==='/palettes/[...query]') {
                if (replace) {
                    state.queryList = { ...state.queryList, query: [{ ...data, type }] };
                }else {
                    if (type!=='sort') {
                        if (state.queryList['query'].map(data=>data.value).includes(data.value)) {
                            state.queryList = { ...state.queryList, query: state.queryList['query'].filter(query=>query.value!==data.value) };
                        }else {
                            state.queryList = { ...state.queryList, query: [...state.queryList.query, { ...data, type }] };
                        }
                    }else {
                        state.queryList = { ...state.queryList, [type]: value };
                    }
                }
            }else {
                Router.push(`/palettes/${state.queryList.sort.toLowerCase()}/${type==='sort' ? sort.toLowerCase() : data.value.toLowerCase()}`);
            }
        }
    }
})

export const { setPalettes, updateLikePalette, updateDataPalettes, setQueryList, handleAddQuery } = paletteSlice.actions;

//selectors
export const selectPalettes = (state) => state.palettes.palettes;
export const selectPalettesPage = (state) => state.palettes.palettes.meta.pagination.page;
export const selectQueryList = (state) => state.palettes.queryList;

export default paletteSlice.reducer;