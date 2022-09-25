import { createSlice, nanoid } from "@reduxjs/toolkit";
import { NotifRelative } from "../components";

const initialState = {
    saveColor: null,
    loginRes: {
        provider: false,
        nextView: null,
        login: false,
        register: false,
        reset: false
    },
    savePalette: null,
    deletePalette: null,
    dataPopupProject: null,
    dataDeleteProject: null,
    dataDeleteColor: null,
    dataPopupCollection: null,
    dataDeleteCollection: null,
    dataPopupGradient: null,
    dataDeleteGradient: null,
    dataQuickView: null,
    dataExportPalette: null,
    dataCodePopup: null,
    dataExportPaletteAsImg: null,
    dataPopupViewGradient: null,
    dataShowCSSGradient: null,
    dataShowSettingPalette: null,
    dataShowGenerateMethod: null,
    dataPopupLuminance: null,
    dataSingleQuickView: null,
    dataShowUploadImage: null,
    dataFullscreenPalette: null,
    dataMenuMore: null,
    dataNotif: [],
    dataPaletteDetail: null,
}

export const popupSlice = createSlice({
    name: 'popup',
    initialState,
    reducers: {
        //saveColor
        setSaveColor: (state,action) => {
            state.saveColor = action.payload;
        },
        handleSaveColor: {
            reducer: (state,action) => {
                if (action.payload.user) {
                    state.saveColor = action.payload;
                }else {
                    state.loginRes = {
                        provider: true,
                        nextView: 'login',
                        login: false,
                        register: false,
                        reset: false
                    }
                }
            },
            prepare: (user,action,color,data,menu) => {
                return { payload: { action, color, user, data, menu } }
            }
        },
        //loginRes
        setLoginRes: {
            reducer: (state,action) => {
                state.loginRes = action.payload;
            },
            prepare: (next) => {
                return {
                    payload: {
                        provider: true,
                        nextView: next,
                        login: false,
                        register: false,
                        reset: false
                    }
                }
            }
        },
        setLoginResView: {
            reducer: (state,action) => {
                state.loginRes = action.payload;
            },
            prepare: (view) => {
                if (view==='login') {
                    return {
                        payload: {
                            provider: false,
                            nextView: null,
                            login: true,
                            register: false,
                            reset: false
                        }
                    }       
                }else if (view==='register') {
                    return {
                        payload: {
                            provider: false,
                            nextView: null,
                            login: false,
                            register: true,
                            reset: false
                        }
                    } 
                }else if (view==='reset') {
                    return {
                        payload: {
                            provider: false,
                            nextView: null,
                            login: false,
                            register: false,
                            reset: true
                        }
                    } 
                }
            }

        },
        closeLoginRes: (state,action) => {
            state.loginRes[action.payload] = false;
        },
        //savePalette
        setSavePalette: (state,action) => {
            state.savePalette = action.payload;
        },
        handleSavePalette: {
            reducer: (state,action) => {
                if (action.payload.user) {
                    state.savePalette = action.payload;
                }else {
                    state.loginRes = {
                        provider: true,
                        nextView: 'login',
                        login: false,
                        register: false,
                        reset: false
                    }
                }
            },
            prepare: (user,palette,action,view,data,menu) => {
                return {
                    payload: {
                        user,
                        palette,
                        action,
                        view,
                        data,
                        menu
                    }
                }
            }
        },
        //deletePalette
        setIdDeletePalette: {
            reducer: (state,action) => {
                state.deletePalette = action.payload;
            },
            prepare: (id) => {
                return { 
                    payload: {
                        id
                    }
                 }
            }
        },
        setDeletePalette: (state,action) => {
            state.deletePalette = action.payload;
        },
        //dataPopupProject
        setDataPopupProject: {
            reducer: (state,action) => {
                state.dataPopupProject = action.payload;
            },
            prepare: (data) => {
                return {
                    payload: {
                        data
                    }
                }
            }
        },
        openPopupProject: (state) => {
            state.dataPopupProject = {}
        },
        closePopupProject: (state) => {
            state.dataPopupProject = null;
        },
        //dataDeleteProject
        setDataDeleteProject: (state,action) => {
            state.dataDeleteProject = action.payload;
        },
        setIdDeleteProject: {
            reducer: (state,action) => {
                state.dataDeleteProject = action.payload;
            },
            prepare: (id) => {
                return {
                    payload: {
                        id
                    }
                }
            }
        },
        //dataDeleteColor
        setDataDeleteColor: (state,action) => {
            state.dataDeleteColor = action.payload;
        },
        setIdDeleteColor: {
            reducer: (state,action) => {
                state.dataDeleteColor = action.payload;
            },
            prepare: (id) => {
                return {
                    payload: {
                        id
                    }
                }
            }
        },
        //dataPopupCollection
        openPopupCollection: (state) => {
            state.dataPopupCollection = {};
        },
        closePopupCollection: (state) => {
            state.dataPopupCollection = null;
        },
        setDataPopupCollection: {
            reducer: (state,action) => {
                state.dataPopupCollection = action.payload;
            },
            prepare: (data) => {
                return {
                    payload: {
                        data
                    }
                }
            }
        },
        //dataDeleteCollection
        setDataDeleteCollection: (state,action) => {
            state.dataDeleteCollection = action.payload;
        },
        setIdDeleteCollection: {
            reducer: (state,action) => {
                state.dataDeleteCollection = action.payload;
            },
            prepare: (id) => {
                return {
                    payload: {
                        id
                    }
                }
            }
        },
        //dataPopupGradient
        handleSaveGradient: {
            reducer: (state,action) => {
                if (action.payload.user) {
                    state.dataPopupGradient = action.payload;
                }else {
                    state.loginRes = {
                        provider: true,
                        nextView: 'login',
                        login: false,
                        register: false,
                        reset: false
                    }
                }
            },
            prepare: (user, gradient, action, data, update, menu) => {
                return {
                    payload: { user, gradient, action, data, update, menu }
                }
            }
        },
        closePopupGradient: (state) => {
            state.dataPopupGradient = null;
        },
        //dataDeleteGradient
        setDataDeleteGradient: (state,action) => {
            state.dataDeleteGradient = action.payload;
        },
        setIdDeleteGradient: {
            reducer: (state,action) => {
                state.dataDeleteGradient = action.payload;
            },
            prepare: (id) => {
                return {
                    payload: {
                        id
                    }
                }
            }
        },
        setDataQuickView: {
            reducer: (state,action) => {
                state.dataQuickView = action.payload;
            },
            prepare: (palettes) => {
                return {
                    payload: {
                        palettes
                    }
                }
            }
        },
        closePopupQuickView: (state) => {
            state.dataQuickView = null;
        },
        setDataExportPalette: {
            reducer: (state,action) => {
                state.dataExportPalette = action.payload;
            },
            prepare: (palettes) => {
                return {
                    payload: {
                        palettes
                    }
                }
            }
        },
        closePopupExportPalette: (state) => {
            state.dataExportPalette = null;
        },
        setDataCodePopup: {
            reducer: (state,action) => {
                state.dataCodePopup = action.payload;
            },
            prepare: (view,palettes) => {
                return {
                    payload: {
                        view, palettes
                    }
                }
            }
        },
        closeCodePopup: (state) => {
            state.dataCodePopup = null;
        },
        setDataExportPaletteAsImg: {
            reducer: (state,action) => {
                state.dataExportPaletteAsImg = action.payload;
            },
            prepare: (palettes,origin) => {
                return {
                    payload: {
                        palettes, origin
                    }
                }
            }
        },
        closePopupExportPaletteAsImg: (state) => {
            state.dataExportPaletteAsImg = null;
        },
        setDataPopupViewGradient: {
            reducer: (state,action) => {
                state.dataPopupViewGradient = action.payload;
            },
            prepare: (palettes) => {
                return {
                    payload: {
                        palettes
                    }
                }
            }
        },
        closePopupViewGradient: (state) => {
            state.dataPopupViewGradient = null;
        },
        setDataShowCSSGradient: (state,action) => {
            state.dataShowCSSGradient = action.payload;
        },
        setDataShowSettingPalette: (state,action) => {
            state.dataShowSettingPalette = action.payload;
        },
        setDataShowGenerateMethod: (state,action) => {
            state.dataShowGenerateMethod = action.payload;
        },
        setDataPopupLuminance: {
            reducer: (state,action) => {
                state.dataPopupLuminance = action.payload;
            },
            prepare: (palettes) => {
                return {
                    payload: {
                        palettes
                    }
                }
            }
        },
        closePopupLuminance: (state) => {
            state.dataPopupLuminance = null;
        },
        setDataSingleQuickView: {
            reducer: (state,action) => {
                state.dataSingleQuickView = action.payload;
            },
            prepare: (palettes) => {
                return {
                    payload: {
                        palettes
                    }
                }
            }
        },
        closePopupSingleQuickView: (state) => {
            state.dataSingleQuickView = null;
        },
        setDataShowUploadImage: (state,action) => {
            state.dataShowUploadImage = action.payload;
        },
        setDataFullscreenPalette: {
            reducer: (state,action) => {
                state.dataFullscreenPalette = action.payload;
            },
            prepare: (palette,type) => {
                return {
                    payload: {
                        palette, type
                    }
                }
            }
        },
        closePopupFullscreenPalette: (state) => {
            state.dataFullscreenPalette = null;
        },
        setDataMenuMore: (state,action) => {
            state.dataMenuMore = action.payload;
        },
        pushNotif: {
            reducer: (state,action) => {
                state.dataNotif = [...state.dataNotif,action.payload];
            },
            prepare: (text,className,icon,id) => {
                const notif = <NotifRelative text={text} className={className} icon={icon} id={id}/>
                return {
                    payload: notif
                }
            }
        },
        removeNotif: (state,action) => {
            state.dataNotif = state.dataNotif.filter(data=>data.props.id!==action.payload);
        },
        setDataPaletteDetail: (state,action) => {
            state.dataPaletteDetail = action.payload;
        }
    },
})

export const { 
    setSaveColor, 
    handleSaveColor, 
    setLoginRes, 
    setLoginResView, 
    closeLoginRes, 
    resetLoginRes, 
    setSavePalette, 
    handleSavePalette, 
    setIdDeletePalette, 
    setDeletePalette, 
    setDataPopupProject, 
    closePopupProject, 
    openPopupProject, 
    setDataDeleteProject, 
    setIdDeleteProject, 
    setDataDeleteColor, 
    setIdDeleteColor, 
    openPopupCollection, 
    closePopupCollection, 
    etDataPopupCollection, 
    setDataDeleteCollection, 
    setIdDeleteCollection, 
    handleSaveGradient, 
    closePopupGradient, 
    setDataDeleteGradient, 
    setIdDeleteGradient,
    setDataQuickView,
    closePopupQuickView,
    setDataExportPalette,
    closePopupExportPalette,
    setDataCodePopup,
    closeCodePopup,
    setDataExportPaletteAsImg,
    closePopupExportPaletteAsImg,
    setDataPopupViewGradient,
    closePopupViewGradient,
    setDataShowCSSGradient,
    setDataShowSettingPalette,
    setDataShowGenerateMethod,
    setDataPopupLuminance,
    closePopupLuminance,
    setDataSingleQuickView,
    closePopupSingleQuickView,
    setDataShowUploadImage,
    setDataFullscreenPalette,
    closePopupFullscreenPalette,
    setDataMenuMore,
    pushNotif,
    removeNotif,
    setDataPaletteDetail,
    setDataPopupCollection
 } = popupSlice.actions;

// selectors
export const selectSaveColor = (state) => state.popup.saveColor;
export const selectLoginRes = (state) => state.popup.loginRes;
export const selectSavePalette = (state) => state.popup.savePalette;
export const selectDeletePalette = (state) => state.popup.deletePalette;
export const selectIdDeletePalette = (state) => state.popup.deletePalette?.id;
export const selectDataPopupProject = (state) => state.popup.dataPopupProject;
export const selectDataDeleteProject = (state) => state.popup.dataDeleteProject;
export const selectDataDeleteColor = (state) => state.popup.dataDeleteColor;
export const selectIdDeleteColor = (state) => state.popup.dataDeleteColor?.id;
export const selectDataPopupCollection = (state) => state.popup.dataPopupCollection;
export const selectDataDeleteCollection = (state) => state.popup.dataDeleteCollection;
export const selectDataPopupGradient = (state) => state.popup.dataPopupGradient;
export const selectDataDeleteGradient = (state) => state.popup.dataDeleteGradient;
export const selectIdDeleteGradient = (state) => state.popup.dataDeleteGradient?.id;
export const selectDataQuickView = (state) => state.popup.dataQuickView;
export const selectDataExportPalette = (state) => state.popup.dataExportPalette;
export const selectDataCodePopup = (state) => state.popup.dataCodePopup;
export const selectDataExportPaletteAsImg = (state) => state.popup.dataExportPaletteAsImg;
export const selectDataPopupViewGradient = (state) => state.popup.dataPopupViewGradient;
export const selectDataShowCSSGradient = (state) => state.popup.dataShowCSSGradient;
export const selectDataShowSettingPalette = (state) => state.popup.dataShowSettingPalette;
export const selectDataShowGenerateMethod = (state) => state.popup.dataShowGenerateMethod;
export const selectDataPopupLuminance = (state) => state.popup.dataPopupLuminance;
export const selectDataSingleQuickView = (state) => state.popup.dataSingleQuickView;
export const selectDataShowUploadImage = (state) => state.popup.dataShowUploadImage;
export const selectDataFullscreenPalette = (state) => state.popup.dataFullscreenPalette;
export const selectDataMenuMore = (state) => state.popup.dataMenuMore;
export const selectALlNotif = (state) => state.popup.dataNotif;
export const selectDataDetailPalette = (state) => state.popup.dataPaletteDetail;

export default popupSlice.reducer;