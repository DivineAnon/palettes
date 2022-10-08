import axios from "axios";
import chroma from "chroma-js";
import { useRouter } from "next/router";
import { useRef, useState, Fragment, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getColorGroup, GetToken, lightOrDark, usePushNotif,  } from "../lib";
import { addDashboardColor, addDetailDashboardCollectionColors, addDetailDashboardProjectColorsData, setDetailDashboardColor, updateDashboardColor, updateDetailDashboardCollectionColors, updateDetailDashboardProjectColorsData, updateFavoriteData } from "../slices/dashboardSlice";
import { selectSaveColor, setSaveColor } from "../slices/popupSlice";
import { addUserCollection, addUserProject, selectUser } from "../slices/userSlice";
import ColorPickerRelative from "./ColorPickerRelative";
import ContainerPopup from "./ContainerPopup";
import Spinner from "./Spinner";

export default function PopupSaveColor(){
    const dataSaveColor = useSelector(selectSaveColor);
    const dispatch = useDispatch();
    const Router = useRouter();
    const user = useSelector(selectUser);
    const [dataSave, setDataSave] = useState({ name: '', projects: [], collections: [] })
    const popupRef = useRef(null);
    const projectInput =  useRef(null);
    const collectionInput = useRef(null);
    const [loading, setLoading] = useState(false);
    const [activeMenu, setActiveMenu] = useState('info');
    const [showPicker, setShowPicker] = useState(false);
    const [previewColor, setPreviewColor] = useState(`#${dataSaveColor.color}`);
    const handlePushNotif = usePushNotif();
    const checkAddProjects = (project) => {
        if (dataSave.projects.map(p=>p.id).includes(project.id)) {
            setDataSave(before=>({ ...before, projects: before.projects.filter(p=>p.id!==project.id) }));
        }else {
            setDataSave(before=>({ ...before, projects: [...before.projects,project] }));
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
                setDataSave(before=>({ ...before, projects: [...before.projects,newProject] }));
                projectInput.current.value = '';
                setLoading(null);
            }
        }
    }
    const checkAddCollections = (collection) => {
        if (dataSave.collections.map(p=>p.id).includes(collection.id)) {
            setDataSave(before=>({ ...before, collections: before.collections.filter(c=>c.id!==collection.id) }));
        }else {
            setDataSave(before=>({ ...before, collections: [...before.collections,collection] }));
        }
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
                setDataSave(before=>({ ...before, collections: [...before.collections, newCollection] }));
                collectionInput.current.value = '';
            }
        }
    }
    const removeBox = (time) => {
        popupRef.current.classList.remove('sm:animate-fadeIn');
        popupRef.current.classList.remove('animate-translateY');
        popupRef.current.classList.add('sm:animate-fadeOut');
        popupRef.current.classList.add('animate-translateY-reverse');
        const close = setTimeout(()=>{
            dispatch(setSaveColor(null));
        },time)
        return ()=> clearTimeout(close);
    }
    const handleSaveColor = async () => {
        if (loading!=='save') {
            setLoading('save');
            if (dataSaveColor.action==='save') {
                const save = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/saves-colors/save?action=${dataSaveColor.action}`,{
                    data: {
                        ...dataSave,
                        name: dataSave.name ? dataSave.name : 'My new color',
                        color: dataSaveColor.color,
                        author: user.id,
                        colorGroup: getColorGroup(dataSaveColor.color),
                        style: lightOrDark(dataSaveColor.color)==='light' ? 'Bright' : 'Dark'
                    },
                },{
                    headers: {
                        Authorization: `bearer ${GetToken()}`
                    }
                })
                if (Router.pathname==='/user/colors') {
                    dispatch(addDashboardColor(save.data));
                }else if (Router.pathname==='/user/projects/[id]/colors') {
                    const { id } = Router.query;
                    if (dataSave.projects.map(p=>p.id).includes(parseInt(id))) {
                        dispatch(addDetailDashboardProjectColorsData(save.data));
                    }
                }else if (Router.pathname==='/user/collections/[id]/colors') {
                    const { id } = Router.query;
                    if (dataSave.collections.map(col=>col.id).includes(parseInt(id))) {
                        dispatch(addDetailDashboardCollectionColors(save.data));
                    }
                }
                setLoading(null);
                dispatch(setSaveColor(null));
                handlePushNotif({ text: 'Color saved succesfully!', className: 'bg-black', icon: 'checklist' });
            }else if (dataSaveColor.action==='edit') {
                const update = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/saves-colors/save?action=${dataSaveColor.action}`,{
                    data: {
                        ...dataSave,
                        name: dataSave.name ? dataSave.name : 'My new color',
                        color: dataSaveColor.color,
                        author: user.id,
                        colorGroup: getColorGroup(dataSaveColor.color),
                        style: lightOrDark(dataSaveColor.color)==='light' ? 'Bright' : 'Dark'
                    },
                    colorId: dataSaveColor.data.id
                },{
                    headers: {
                        Authorization: `bearer ${GetToken()}`
                    }
                })
                if (Router.pathname==='/user/colors') {
                    dispatch(updateDashboardColor(update.data));
                }else if (Router.pathname==='/user/colors/[hex]') {
                    dispatch(setDetailDashboardColor(update.data));
                }else if (Router.pathname==='/user/projects/[id]/colors') {
                    dispatch(updateDetailDashboardProjectColorsData(update.data));
                }else if (Router.pathname==='/user/collections/[id]/colors') {
                    dispatch(updateDetailDashboardCollectionColors(update.data));
                }else if (Router.pathname==='/user/favorites/colors') {
                    dispatch(updateFavoriteData({ data: update.data, type: 'colors' }));
                }
                setLoading(null);
                dispatch(setSaveColor(null));
                handlePushNotif({ text: 'Color updated succesfully!', className: 'bg-black', icon: 'checklist' });
            }
        }
    }
    const handleChangeColor = (e) => {
        setPreviewColor(e.target.value);
        if (chroma.valid(e.target.value)) {
            dispatch(setSaveColor({...dataSaveColor, color: chroma(chroma(e.target.value).rgb()).hex().slice(1)}));
        }
    }
    const handleChangeColorPicker = (e) => {
        dispatch(setSaveColor({...dataSaveColor, color: e.hex.slice(1)}));
        setPreviewColor(e.hex);
    }
    useLayoutEffect(()=>{
        if (dataSaveColor.data) {
            const { name, projects, collections } = dataSaveColor.data;
            setDataSave({ name: name ? name + (dataSaveColor.action==='duplicate' ? ' Copy' : '') : '', projects: projects ? projects : [] , collections: collections ? collections : [] });
        }
        if (dataSaveColor.menu) {
            setActiveMenu(dataSaveColor.menu);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={popupRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[468px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl flex flex-col divide-y">
                <div className="p-3 relative">
                    <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 transition cursor-pointer p-1.5 rounded-lg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h1 className="font-semibold text-center">{dataSaveColor.action==='save' ? 'Save' : 'Edit'} Color</h1>
                </div>
                <div className="flex justify-center items-center text-[15px]">
                    <button onClick={()=>setActiveMenu('info')} className={`py-3.5 px-3 font-medium transition relative text-scondary ${activeMenu==='info' ? "before:content-[''] before:w-full before:left-0 before:top-full before:h-[2px] before:bg-blue-500 before:-translate-y-[2px] before:absolute text-blue-500" : 'hover:text-black' }`}>Info</button>
                    <button onClick={()=>setActiveMenu('projects')} className={`py-3.5 px-3 font-medium transition relative text-scondary ${activeMenu==='projects' ? "before:content-[''] before:w-full before:left-0 before:top-full before:h-[2px] before:bg-blue-500 before:-translate-y-[2px] before:absolute text-blue-500" : 'hover:text-black' }`}>Projects</button>
                    <button onClick={()=>setActiveMenu('collections')} className={`py-3.5 px-3 font-medium transition relative text-scondary ${activeMenu==='collections' ? "before:content-[''] before:w-full before:left-0 before:top-full before:h-[2px] before:bg-blue-500 before:-translate-y-[2px] before:absolute text-blue-500" : 'hover:text-black' }`}>Collections</button>
                </div>
                <div className="p-6">
                    {activeMenu==='info' && (
                        <Fragment>
                            <label htmlFor="_name" className="text-sm font-medium mb-2 block">Name</label>
                            <input value={dataSave.name} onChange={(e)=>setDataSave({ ...dataSave, name: e.target.value })} id="_name" type="text" name="name" className="border border-gray-300 w-full px-4 py-3 text-[15px] focus:border-blue-500 outline-none transition hover:border-gray-400 rounded-xl font-medium mb-2.5" placeholder="My new color"/>
                            <label htmlFor="colorActive_" className="text-sm font-medium mb-2.5 block">Color</label>
                            <div className="relative">
                                <input onChange={handleChangeColor} value={previewColor} id="colorActive_" type="text" name="activeColor" className="border border-gray-300 w-full pl-4 pr-[50px] py-3 text-[15px] focus:border-blue-500 outline-none transition hover:border-gray-400 rounded-xl font-medium uppercase" placeholder={`#${dataSaveColor.color.toUpperCase()}`}/>
                                <div onClick={()=>setShowPicker(true)} style={{ backgroundColor: `#${dataSaveColor.color}` }} className="w-8 h-8 btn-picker-save rounded-md absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"></div>
                                {showPicker && (
                                <ColorPickerRelative width={272} setState={setShowPicker} onChange={handleChangeColorPicker} color={dataSaveColor.color} targetClass={'btn-picker-save'}/>
                                )}
                            </div>
                        </Fragment>
                    )}
                    {activeMenu==='projects' && (
                        <Fragment>
                            <p className="text-[15px] font-medium mb-2 block">Select projects</p>
                            <div className="border border-gray-300 w-full p-2 text-[15px] outline-none transition rounded-xl font-medium max-h-[200px] overflow-auto hide-scrollbar flex flex-col gap-1">
                                {user.projects.data.length>0 ? (
                                    user.projects.data.map((project)=>(
                                    <div key={project.id} onClick={()=>checkAddProjects(project)} className={`px-3 rounded-lg py-1 cursor-pointer flex items-center justify-between ${dataSave.projects.map(p=>p.id).includes(project.id) ? 'bg-blue-100/70 text-blue-500 hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                        <p className="text-[15px]">{project.name}</p>
                                        {dataSave.projects.map(p=>p.id).includes(project.id) && (
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
                                    <div key={col.id} onClick={()=>checkAddCollections(col)} className={`px-3 rounded-lg py-1 cursor-pointer flex items-center justify-between ${dataSave.collections.map(c=>c.id).includes(col.id) ? 'bg-blue-100/70 text-blue-500 hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                        <p className="text-[15px]">{col.name}</p>
                                        {dataSave.collections.map(c=>c.id).includes(col.id) && (
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
                    <button onClick={handleSaveColor} className="h-[46px] text-center font-bold bg-blue-500 hover:bg-blue-600 transition text-white w-full block rounded-xl">{loading==='save' ? <Spinner/> : 'Save'}</button>
                </div>
            </div>
        </ContainerPopup>
    )
}