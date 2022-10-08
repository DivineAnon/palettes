import axios from "axios";
import chroma from "chroma-js";
import { useRouter } from "next/router";
import { useLayoutEffect } from "react";
import { useEffect } from "react";
import { useState, useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dataCreatePalette, GetToken, lightOrDark, usePushNotif } from "../lib";
import { addDashboardPalette, addDetailDashboardCollectionPalettes, addDetailDashboardProjectPalettesData, setDetailDashboardPalette, updateDashboardPalette, updateDetailDashboardCollectionPalettes, updateDetailDashboardProjectPalettesData, updateFavoriteData } from "../slices/dashboardSlice";
import { updateLikePalette } from "../slices/palettesSlice";
import { selectSavePalette, setSavePalette } from "../slices/popupSlice";
import { addNewPaletteLibrary, updatePaletteLibrary } from "../slices/sidebarSlice";
import { updateSinglePaletteLike } from "../slices/singlePaletteSlice";
import { addUserCollection, addUserProject, selectUser } from "../slices/userSlice";
import ColorPickerRelative from "./ColorPickerRelative";
import ContainerPopup from "./ContainerPopup";
import Spinner from "./Spinner";

export default function PopupSavePalette(){
    const user = useSelector(selectUser);
    const dataPalette = useSelector(selectSavePalette);
    const dispatch = useDispatch();
    const Router = useRouter();
    const handlePushNotif = usePushNotif();
    const [activeMenu, setActiveMenu] = useState('info');
    const [loading, setLoading] = useState(null);
    const [valueTag, setValueTag] = useState('');
    const [showAddTag, setShowAddTag] = useState(false);
    const [dataSavePalette, setDataSavePalette] = useState({ name: '', description: '', projects: [], collections: [], tags: [] });
    const [paletteColors, setPaletteColors] = useState(dataPalette.palette);
    const [activeColor, setActiveColor] = useState(0);
    const [previewColor, setPreviewColor] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const popupRef = useRef(null);
    const projectInput =  useRef(null);
    const collectionInput = useRef(null);
    const handleUnfocus = () => {
        const timeout = setTimeout(()=>{
            setShowAddTag(false);
        },110)
        return ()=> clearTimeout(timeout);
    }
    const handleAddCollection = async () => {
        if (loading!=='collections') {
            let value = collectionInput.current.value;
            if (value) {
                setLoading('collections');
                const create = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/collections`,{
                    data: {
                        name: value,
                        author: user.id
                    }
                },{
                    headers: {
                        Authorization: `bearer ${GetToken()}`
                    }
                })
                const newCollection = { ...create.data.data };
                dispatch(addUserCollection(newCollection));
                setLoading(null);
                setDataSavePalette(before=>({ ...before, collections: [...before.collections,newCollection] }));
                collectionInput.current.value = '';
            }
        }
    }
    const handleAddProject = async () => {
        if (loading!=='projects') {
            let value = projectInput.current.value;
            if (value) {
                setLoading('projects');
                const create = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/projects`,{
                    data: {
                        name: value,
                        author: user.id
                    }
                },{
                    headers: {
                        Authorization: `bearer ${GetToken()}`
                    }
                })
                const newProject = { ...create.data.data };
                dispatch(addUserProject(newProject));
                setDataSavePalette(before=>({ ...before, projects: [...before.projects,newProject] }));
                projectInput.current.value = '';
                setLoading(null);
            }
        }
    }
    const removeTag = (index) => {
        setDataSavePalette(before=>({ ...before, tags: before.tags.filter((t,i)=>i!==index) }));
    }
    const removeBox = (time) => {
        popupRef.current.classList.remove('sm:animate-fadeIn');
        popupRef.current.classList.remove('animate-translateY');
        popupRef.current.classList.add('sm:animate-fadeOut');
        popupRef.current.classList.add('animate-translateY-reverse');
        const close = setTimeout(()=>{
            dispatch(setSavePalette(null));
        },time)
        return ()=> clearTimeout(close);
    }
    const handleAddColor = () => {
        if (paletteColors.length<10) {
            const newColor = chroma(paletteColors[activeColor]).brighten(.2).hex().slice(1);
            const palBefore = paletteColors.slice(0,activeColor);
            const palAfter = paletteColors.slice(activeColor);
            setPaletteColors([...palBefore,newColor,...palAfter]);
        }
    }
    const handleRemoveColor = () => {
        if (paletteColors.length>2) {
            const newPalette = [...paletteColors].filter((p,i)=>i!==activeColor);
            setPaletteColors(newPalette);
            if (activeColor===paletteColors.length-1) {
                setActiveColor(0);
            }
        }
    }
    const handleChangeColor = (e) => {
        setPreviewColor(e.target.value);
        if (chroma.valid(e.target.value)) {
            const newPalette = [...paletteColors];
            newPalette[activeColor] = chroma(chroma(e.target.value).rgb()).hex().slice(1);
            setPaletteColors(newPalette);
        }
    }
    const handleChangeColorPicker = (e) => {
        const newPalette = [...paletteColors];
        newPalette[activeColor] = e.hex.slice(1);
        setPaletteColors(newPalette);
        setPreviewColor(`#${e.hex.slice(1).toUpperCase()}`);
    }
    const handleSavePalette = async () => {
        if (loading!=='save') {
            setLoading('save');
            if (dataPalette.action==='save' || dataPalette.action==='duplicate'){
                const save = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/saves-palettes/save?action=${dataPalette.action}`,{
                    data: {
                        name: dataSavePalette.name ? dataSavePalette.name : 'My new palette',
                        description: dataSavePalette.description ? dataSavePalette.description : null,
                        tags: dataSavePalette.tags.length>0 ? dataSavePalette.tags : null,
                        author: user.id,
                        collections: dataSavePalette.collections.map(c=>c.id),
                        projects: dataSavePalette.projects.map(p=>p.id),
                    },
                    palette: {
                        ...dataCreatePalette(paletteColors.join('-')),
                    },
                },{
                    headers: {
                        Authorization: `bearer ${GetToken()}`
                    }
                })
                if (dataPalette.view==='list') {
                    dispatch(updateLikePalette(save.data.palette));
                }else if (dataPalette.view==='single') {
                    dispatch(updateSinglePaletteLike(save.data.palette));
                }
                if ((Router.pathname==='/[hex]' && Router.query.hex.split('-').length>1) || Router.pathname==='/palettes/[...query]') {
                    dispatch(addNewPaletteLibrary(save.data.saved));
                }
                if (Router.pathname==='/user/palettes') {
                    dispatch(addDashboardPalette(save.data.saved));
                }
                if (Router.pathname==='/user/projects/[id]/palettes') {
                    const { id } = Router.query;
                    if (dataSavePalette.projects.map(p=>p.id).includes(parseInt(id))) {
                        dispatch(addDetailDashboardProjectPalettesData(save.data.saved));
                    }
                }
                if (Router.pathname==='/user/collections/[id]/palettes') {
                    const { id } = Router.query;
                    if (dataSavePalette.collections.map(p=>p.id).includes(parseInt(id))) {
                        dispatch(addDetailDashboardCollectionPalettes(save.data.saved));
                    }
                }
                setLoading(null);
                dispatch(setSavePalette(null));
                handlePushNotif({ text: 'Palette saved succesfully!', className: 'bg-black', icon: 'checklist' });
            }else if (dataPalette.action==='edit') {
                const edit = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/saves-palettes/save?action=${dataPalette.action}`,{
                    data: {
                        name: dataSavePalette.name ? dataSavePalette.name : 'My new palette',
                        description: dataSavePalette.description ? dataSavePalette.description : null,
                        tags: dataSavePalette.tags.length>0 ? dataSavePalette.tags : null,
                        author: user.id,
                        collections: dataSavePalette.collections.map(c=>c.id),
                        projects: dataSavePalette.projects.map(p=>p.id),
                    },
                    palette: {
                        ...dataCreatePalette(paletteColors.join('-')),
                    },
                    saveId: dataPalette.data.id
                },{
                    headers: {
                        Authorization: `bearer ${GetToken()}`
                    }
                })
                const { saves } = edit.data;
                if ((Router.pathname==='/[hex]' && Router.query.hex.split('-').length>1) || Router.pathname==='/palettes/[...query]') {
                    dispatch(updatePaletteLibrary(saves));
                }else if (Router.pathname==='/user/palettes') {
                    dispatch(updateDashboardPalette(saves));
                }else if (Router.pathname==='/user/palettes/[slug]') {
                    dispatch(setDetailDashboardPalette(saves));
                }else if (Router.pathname==='/user/projects/[id]/palettes') {
                    dispatch(updateDetailDashboardProjectPalettesData(saves));
                }else if (Router.pathname==='/user/collections/[id]/palettes') {
                    dispatch(updateDetailDashboardCollectionPalettes(saves));
                }else if (Router.pathname==='/user/favorites/palettes') {
                    dispatch(updateFavoriteData({ data: saves, type: 'palettes' }));
                }
                setLoading(null);
                dispatch(setSavePalette(null));
                handlePushNotif({ text: 'Palette updated succesfully!', className: 'bg-black', icon: 'checklist' });
            }
        }
    }
    const checkAddProjects = (project) => {
        if (dataSavePalette.projects.map(p=>p.id).includes(project.id)) {
            setDataSavePalette(before=>({ ...before, projects: before.projects.filter(p=>p.id!==project.id) }));
        }else {
            setDataSavePalette(before=>({ ...before, projects: [...before.projects,project] }));
        }
    }
    const checkAddCollections = (collection) => {
        if (dataSavePalette.collections.map(p=>p.id).includes(collection.id)) {
            setDataSavePalette(before=>({ ...before, collections: before.collections.filter(c=>c.id!==collection.id) }));
        }else {
            setDataSavePalette(before=>({ ...before, collections: [...before.collections,collection] }));
        }
    }
    useLayoutEffect(()=>{
        if (dataPalette.data) {
            const { name, description, tags, projects, collections } = dataPalette.data;
            setDataSavePalette({ name: name ? name + (dataPalette.action==='duplicate' ? ' Copy' : '') : '', description: description ? description : '', projects: projects ? projects : [], collections: collections ? collections : [], tags: tags ? tags : [] });
        }
        if (dataPalette.menu) {
            setActiveMenu(dataPalette.menu);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(()=>{
        setPreviewColor(`#${paletteColors[activeColor].toUpperCase()}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[activeColor])
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={popupRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[468px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl flex flex-col divide-y">
                <div className="p-3 relative">
                    <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 transition cursor-pointer p-1.5 rounded-lg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h1 className="font-semibold text-center">{dataPalette.action==='save' ? 'Save' : dataPalette.action==='duplicate' ? 'Duplicate' : 'Edit'} Palette</h1>
                </div>
                <div className="flex justify-center items-center text-[15px]">
                    <button onClick={()=>setActiveMenu('info')} className={`py-3.5 px-3 font-medium transition relative text-scondary ${activeMenu==='info' ? "before:content-[''] before:w-full before:left-0 before:top-full before:h-[2px] before:bg-blue-500 before:-translate-y-[2px] before:absolute text-blue-500" : 'hover:text-black' }`}>Info</button>
                    <button onClick={()=>setActiveMenu('colors')} className={`py-3.5 px-3 font-medium transition relative text-scondary ${activeMenu==='colors' ? "before:content-[''] before:w-full before:left-0 before:top-full before:h-[2px] before:bg-blue-500 before:-translate-y-[2px] before:absolute text-blue-500" : 'hover:text-black' }`}>Colors</button>
                    <button onClick={()=>setActiveMenu('projects')} className={`py-3.5 px-3 font-medium transition relative text-scondary ${activeMenu==='projects' ? "before:content-[''] before:w-full before:left-0 before:top-full before:h-[2px] before:bg-blue-500 before:-translate-y-[2px] before:absolute text-blue-500" : 'hover:text-black' }`}>Projects</button>
                    <button onClick={()=>setActiveMenu('collections')} className={`py-3.5 px-3 font-medium transition relative text-scondary ${activeMenu==='collections' ? "before:content-[''] before:w-full before:left-0 before:top-full before:h-[2px] before:bg-blue-500 before:-translate-y-[2px] before:absolute text-blue-500" : 'hover:text-black' }`}>Collections</button>
                </div>
                <div className="p-6">
                    {activeMenu==='info' && (
                        <Fragment>
                            <label htmlFor="_name" className="text-sm font-medium mb-2 block">Name</label>
                            <input value={dataSavePalette.name} onChange={(e)=>setDataSavePalette({ ...dataSavePalette, name: e.target.value })} id="_name" type="text" name="name" className="border border-gray-300 w-full px-4 py-3 text-[15px] focus:border-blue-500 outline-none transition hover:border-gray-400 rounded-xl font-medium" placeholder="My new palette"/>
                            <label htmlFor="_description" className="text-sm font-medium mb-2 mt-3 block">Description</label>
                            <textarea onChange={(e)=>setDataSavePalette({ ...dataSavePalette, description: e.target.value })} value={dataSavePalette.description} name="" id="" className="border border-gray-300 w-full px-4 py-3 text-[15px] focus:border-blue-500 outline-none transition hover:border-gray-400 rounded-xl font-medium resize-none h-[84px]"></textarea>
                            <div className="mt-1.5">
                                <p className="text-sm font-medium mb-2">Tags</p>
                                <div className={`relative border text-[15px] rounded-lg ${showAddTag ? `border-x-blue-500 border-t-blue-500 ${valueTag ? 'border-b-0 rounded-bl-none rounded-br-none' : 'border-b-blue-500'}` : 'hover:border-gray-400 border-gray-300'}`}>
                                    <div className="p-2 flex flex-wrap gap-2">
                                        {dataSavePalette.tags.map((tag,i)=>(
                                        <div key={i} onClick={()=>removeTag(i)} className="bg-[#e6f0ff] h-[30px] flex-1 gap-[40px] px-2 rounded text-[#0066ff] whitespace-nowrap flex items-center justify-between cursor-pointer hover:bg-[#d6e7ff]">
                                            <span className="font-medium">{tag}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        ))}
                                        <input value={valueTag} onChange={(e)=>setValueTag(e.target.value)} type="text" placeholder="Add new" onFocus={()=>setShowAddTag(true)} onBlur={handleUnfocus} className="cursor-pointer placeholder:text-scondary focus:placeholder:text-gray-400 px-2 outline-none flex-1 rounded-lg h-[30px]"/>
                                    </div>
                                    {showAddTag && valueTag && (
                                    <div onClick={()=>{setDataSavePalette(before=>({...before, tags: [...before.tags,valueTag]}));setValueTag('')}} className="absolute bg-white outline outline-[1px] p-1.5 w-full outline-blue-500 top-full rounded-bl-lg rounded-br-lg max-h-[143px] overflow-auto hide-scrollbar">
                                        <div className="hover:bg-gray-100 px-3 py-1 rounded cursor-pointer">Add {valueTag}</div>
                                    </div>
                                    )}
                                </div>
                            </div>
                        </Fragment>
                    )}
                    {activeMenu==='colors' && (
                        <Fragment>
                            <label htmlFor="colorActive_" className="text-sm font-medium mb-2.5 block">Color</label>
                            <div className="relative mb-4">
                                <input onChange={handleChangeColor} value={previewColor} id="colorActive_" type="text" name="activeColor" className="border border-gray-300 w-full pl-4 pr-[50px] py-3 text-[15px] focus:border-blue-500 outline-none transition hover:border-gray-400 rounded-xl font-medium" placeholder="#2A9D8F"/>
                                <div onClick={()=>setShowPicker(true)} style={{ backgroundColor: `#${paletteColors[activeColor]}` }} className="w-8 h-8 btn-picker-save rounded-md absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"></div>
                                {showPicker && (
                                <ColorPickerRelative width={272} setState={setShowPicker} onChange={handleChangeColorPicker} color={paletteColors[activeColor]} targetClass={'btn-picker-save'}/>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <div className="h-[46px] rounded-xl flex overflow-hidden flex-1">
                                    {paletteColors.map((color,i)=>(
                                    <div key={i} onClick={()=>setActiveColor(i)} style={{ backgroundColor: `#${color}` }} className="flex-1 flex items-center justify-center group cursor-pointer">
                                        <div className={`w-2 h-2 rounded-full ${activeColor===i ? `visible ${lightOrDark(color)==='light' ? 'bg-black' : 'bg-white'}` : `invisible group-hover:visible ${lightOrDark(color)==='light' ? 'bg-black/20' : 'bg-white/20'}`}`}></div>
                                    </div>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <button onClick={handleAddColor} className={`border flex-1 w-[23px] h-[23px] rounded-tl-md rounded-tr-md border-b-0 transition ${paletteColors.length<10 ? 'peer hover:border-gray-400' : 'border-gray-100 text-gray-400 cursor-default'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mx-auto">
                                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                        </svg>
                                    </button>
                                    <button onClick={handleRemoveColor} className={`border flex-1 w-[23px] h-[23px] rounded-bl-md rounded-br-md peer-hover:border-t-gray-400 transition ${paletteColors.length > 2 ? 'hover:border-gray-400' : 'border-gray-100 text-gray-400 cursor-default'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mx-auto">
                                            <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </Fragment>
                    )}
                    {activeMenu==='projects' && (
                        <Fragment>
                            <p className="text-[15px] font-medium mb-2 block">Select projects</p>
                            <div className="border border-gray-300 w-full p-2 text-[15px] outline-none transition rounded-xl font-medium max-h-[200px] overflow-auto hide-scrollbar flex flex-col gap-1">
                                {user.projects.data.length>0 ? (
                                    user.projects.data.map((project)=>(
                                    <div key={project.id} onClick={()=>checkAddProjects(project)} className={`px-3 rounded-lg py-1 cursor-pointer flex items-center justify-between ${dataSavePalette.projects.map(p=>p.id).includes(project.id) ? 'bg-blue-100/70 text-blue-500 hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                        <p className="text-[15px]">{project.name}</p>
                                        {dataSavePalette.projects.map(p=>p.id).includes(project.id) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        )}
                                    </div>
                                    ))
                                ) : (
                                    <p className="text-[15px] px-3 rounded-lg py-1 text-gray-400">No projects yet.</p>
                                )}
                            </div>
                            <div className="relative mt-4">
                                <input ref={projectInput} className="border border-gray-300 w-full px-4 py-3 text-[15px] focus:border-blue-500 outline-none transition hover:border-gray-400 rounded-xl font-medium" placeholder="New project"/>
                                <button onClick={handleAddProject} className="px-3 py-1 rounded-lg transition hover:bg-gray-100 absolute right-2 top-1/2 -translate-y-1/2">{loading==='projects' ? <Spinner/> : 'Add'}</button>
                            </div>
                        </Fragment>
                    )}
                    {activeMenu==='collections' && (
                        <Fragment>
                            <p className="text-[15px] font-medium mb-2 block">Select collections</p>
                            <div className="border border-gray-300 w-full p-2 text-[15px] outline-none transition rounded-xl font-medium max-h-[200px] overflow-auto hide-scrollbar flex flex-col gap-1">
                                {user.collections.data.length > 0 ? (
                                    user.collections.data.map((col)=>(
                                    <div key={col.id} onClick={()=>checkAddCollections(col)} className={`px-3 rounded-lg py-1 cursor-pointer flex items-center justify-between ${dataSavePalette.collections.map(c=>c.id).includes(col.id) ? 'bg-blue-100/70 text-blue-500 hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                        <p className="text-[15px]">{col.name}</p>
                                        {dataSavePalette.collections.map(c=>c.id).includes(col.id) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        )}
                                    </div>
                                    ))
                                ) : (
                                    <p className="text-[15px] px-3 rounded-lg py-1 text-gray-400">No collections yet.</p>
                                )}
                            </div>
                            <div className="relative mt-4">
                                <input ref={collectionInput} className="border border-gray-300 w-full px-4 py-3 text-[15px] focus:border-blue-500 outline-none transition hover:border-gray-400 rounded-xl font-medium" placeholder="New collection"/>
                                <button onClick={handleAddCollection} className="px-3 py-1 rounded-lg transition hover:bg-gray-100 absolute right-2 top-1/2 -translate-y-1/2">{loading==='collections' ? <Spinner/> : 'Add'}</button>
                            </div>
                        </Fragment>
                    )}
                </div>
                <div className="p-4">
                    <button onClick={handleSavePalette} className="h-[46px] text-center font-bold bg-blue-500 hover:bg-blue-600 transition text-white w-full block rounded-xl">{loading==='save' ? <Spinner/> : 'Save'}</button>
                </div>
            </div>
        </ContainerPopup>
    )
}