import axios from "axios";
import chroma from "chroma-js";
import { useRouter } from "next/router";
import { useRef, useState, Fragment, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dataCreateGradient, GetToken, handlePushNotif } from "../lib";
import { addDashboardGradient, updateDashboardGradient } from "../slices/dashboardSlice";
import { updateLikeGradient } from "../slices/gradientsSlice";
import { closePopupGradient, selectDataPopupGradient, setDataMenuMore } from "../slices/popupSlice";
import { addUserCollection, addUserProject, selectUser } from "../slices/userSlice";
import ColorPickerRelative from "./ColorPickerRelative";
import ContainerPopup from "./ContainerPopup";
import Spinner from "./Spinner";

export default function PopupSaveGradient(){
    const popupRef = useRef(null);
    const projectInput =  useRef(null);
    const collectionInput = useRef(null);
    const btnRotationRef = useRef(null);
    const btnMorePosition = useRef(null);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const Router = useRouter();
    const dataShowSaveGradient = useSelector(selectDataPopupGradient);
    const [dataSave, setDataSave] = useState({ name: '', description: '', tags: [], projects: [], collections: [] })
    const [activeMenu, setActiveMenu] = useState('info');
    const [valueTag, setValueTag] = useState('');
    const [showAddTag, setShowAddTag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [colors, setColors] = useState(JSON.parse(dataShowSaveGradient.gradient.palette));
    const [rotation, setRotation] = useState(dataShowSaveGradient.gradient.rotation);
    const [type,setType] = useState(dataShowSaveGradient.gradient.type);
    const [showMoreType, setShowMoreType] = useState(false);
    const [focusColor, setFocusColor] = useState(JSON.parse(dataShowSaveGradient.gradient.palette)[0]);
    const removeTag = (index) => {
        setDataSave(before=>({ ...before, tags: before.tags.filter((t,i)=>i!==index) }));
    }
    const handleUnfocus = () => {
        const timeout = setTimeout(()=>{
            setShowAddTag(false);
        },110)
        return ()=> clearTimeout(timeout);
    }
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
                setDataSave(before=>({ ...before, collections: [...before.collections,newCollection] }));
                collectionInput.current.value = '';
            }
        }
    }
    const handleSaveGradient = async () => {
        const { gradient, action, data, update } = dataShowSaveGradient;
        if (loading!=='save') {
            setLoading('save');
            if (action==='save' || action==='duplicate'){
                const save = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/saves-gradients/save?action=${action}`,{
                    data: {
                        name: dataSave.name ? dataSave.name : 'My new gradient',
                        description: dataSave.description ? dataSave.description : null,
                        tags: dataSave.tags.length>0 ? dataSave.tags : null,
                        author: user.id,
                        collections: dataSave.collections.map(c=>c.id),
                        projects: dataSave.projects.map(p=>p.id),
                    },
                    gradient: {
                        ...dataCreateGradient(colors,type,rotation)
                    }
                },{
                    headers: {
                        Authorization: `bearer ${GetToken()}`
                    }
                })
                if (update==='list') {
                    dispatch(updateLikeGradient(save.data.gradient));
                }
                if (Router.pathname==='/user/gradients') {
                    dispatch(addDashboardGradient(save.data.saved));
                }
                setLoading(null);
                dispatch(closePopupGradient());
                handlePushNotif({ text: 'Gradient saved succesfully!', className: 'bg-black', icon: 'checklist' });
            }else if (action==='edit') {
                const edit = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/saves-gradients/save?action=${action}`,{
                    data: {
                        name: dataSave.name ? dataSave.name : 'My new gradient',
                        description: dataSave.description ? dataSave.description : null,
                        tags: dataSave.tags.length>0 ? dataSave.tags : null,
                        author: user.id,
                        collections: dataSave.collections.map(c=>c.id),
                        projects: dataSave.projects.map(p=>p.id),
                    },
                    gradient: {
                        ...dataCreateGradient(colors,type,rotation)
                    },
                    saveId: dataShowSaveGradient.data.id
                },{
                    headers: {
                        Authorization: `bearer ${GetToken()}`
                    }
                })
                const gradient = edit.data;
                if (Router.pathname==='/user/gradients') {
                    dispatch(updateDashboardGradient(gradient));
                }
                setLoading(null);
                dispatch(closePopupGradient());
                handlePushNotif({ text: 'Gradient updated succesfully!', className: 'bg-black', icon: 'checklist' });
            }
        }
    }
    const handleChangeColor = (e) => {
        const newData = {...focusColor};
        newData = { ...newData, color: e.target.value.slice(1) };
        setFocusColor(newData);
        if (chroma.valid(e.target.value.replace('#',''))) {
            const newDataColors = [...colors];
            newDataColors[focusColor.index] = {  ...newDataColors[focusColor.index], color: e.target.value.slice(1) };
            setColors(newDataColors);
        }
    }
    const handleChangePicker = (ctx) => {
        const { hex } = ctx;
        setFocusColor(before=>({ ...before, color: hex.slice(1) }));
        const newData = [...colors];
        newData[focusColor.index] = { ...newData[focusColor.index], color: hex.slice(1)};
        setColors(newData);
    }
    const removeBox = (time) => {
        popupRef.current.classList.remove('sm:animate-fadeIn');
        popupRef.current.classList.remove('animate-translateY');
        popupRef.current.classList.add('sm:animate-fadeOut');
        popupRef.current.classList.add('animate-translateY-reverse');
        const close = setTimeout(()=>{
            dispatch(closePopupGradient());
        },time)
        return ()=> clearTimeout(close);
    }
    const menuMoreRotation = ()=> (
        <section>
            <div onClick={()=>setRotation(0)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===0 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">0°</span>
                {rotation===0 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(45)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===45 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">45°</span>
                {rotation===45 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(90)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===90 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">90°</span>
                {rotation===90 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(135)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===135 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">135°</span>
                {rotation===135 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(180)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===180 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">180°</span>
                {rotation===180 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(225)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===225 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">225°</span>
                {rotation===225 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(270)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===270 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">270°</span>
                {rotation===270 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(315)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===315 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">315°</span>
                {rotation===315 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(360)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===360 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">360°</span>
                {rotation===360 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
        </section>
    )
    const menuMorePosition = () => (
        <section>
            <div onClick={()=>handlePositionDropdown(0)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===0 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">0%</span>
                {focusColor.position===0 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(10)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===10 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">10%</span>
                {focusColor.position===10 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(20)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===20 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">20%</span>
                {focusColor.position===20 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(30)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===30 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">30%</span>
                {focusColor.position===30 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(40)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===40 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">40%</span>
                {focusColor.position===40 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(50)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===50 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">50%</span>
                {focusColor.position===50 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(60)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===60 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">60%</span>
                {focusColor.position===60 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(70)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===70 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">70%</span>
                {focusColor.position===70 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(80)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===80 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">80%</span>
                {focusColor.position===80 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(90)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===90 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">90%</span>
                {focusColor.position===90 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(100)} className={`px-2.5 py-0.5 rounded cursor-pointer ${focusColor.position===100 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">100%</span>
                {focusColor.position===100 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
        </section>
    )
    const handlePositionDropdown = (value) => {
        const newData = [...colors];
        setFocusColor(before=>({ ...before, position: value }));
        newData[focusColor.index] = { ...newData[focusColor.index], position: value };
        setColors(newData);
    }
    const replacePosition = (value,i) => {
        if (!isNaN(parseInt(value))){
            const newData = [...colors];
            newData[i].position = parseInt(value) > 100 ? 100 : parseInt(value);
            setFocusColor(newData[i]);
            setColors(newData);
        }else {
            const newData = [...colors];
            newData[i].position = 0;
            setFocusColor(newData[i]);
            setColors(newData);
        }
    }
    const handleChangeRotation = () => {
        let value = parseInt(e.target.value.replace('°',''));
        if (!isNaN(value)) {
            setRotation(value>360 ? 360 : value);
        }else {
            setRotation(0);
        }
    }
    const handleOnChange = (e,i) => {
        const newData = [...colors];
        setFocusColor(before=>({ ...before, position: parseInt(e.target.value) }));
        newData[i] = { ...newData[i], position: parseInt(e.target.value) };
        setColors(newData);
    }
    const getGradientPreview = () => {
        return `${type}-gradient(${type==='linear' ? rotation+'deg' : 'circle'}, ${colors.map(obj=>[`#${obj.color} ${obj.position}%`]).join(',')}`;
    }
    const handleRemoveColor = () => {
        const newData = [...colors].filter((el,i)=>i!==focusColor.index);
        const newIndex = [];
        newData.forEach((data,i)=>{
            newIndex.push({ ...data, index: i });
        })
        setColors(newIndex);
        setFocusColor(newIndex[0]);
    }
    useLayoutEffect(()=>{
        let style = document.querySelector('[data="slider"]');
        let input = document.querySelectorAll('input[type="range"].range-gradient');
        if (input) {
            let dataClass = [];
            input.forEach(element=>{
                dataClass.push(`.${element.dataset.class}::-webkit-slider-thumb{ background-color: #${element.dataset.color} }`);
            })
            style.innerHTML = dataClass.join('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[colors,activeMenu]);
    useLayoutEffect(()=>{
        if (dataShowSaveGradient.data) {
            const { name, description, tags, projects, collections } = dataShowSaveGradient.data;
            setDataSave({ name: name ? name + (dataShowSaveGradient.action==='duplicate' ? ' Copy' : '') : '', description: description ? description : '', projects, collections, tags: tags ? tags : [] });
        }
        if (dataShowSaveGradient.menu) {
            setActiveMenu(dataShowSaveGradient.menu);
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
                    <h1 className="font-semibold text-center">Save Gradient</h1>
                </div>
                <div className="flex justify-center items-center text-[15px]">
                    <button onClick={()=>setActiveMenu('info')} className={`py-3.5 px-3 font-medium transition relative text-scondary ${activeMenu==='info' ? "before:content-[''] before:w-full before:left-0 before:top-full before:h-[2px] before:bg-blue-500 before:-translate-y-[2px] before:absolute text-blue-500" : 'hover:text-black' }`}>Info</button>
                    <button onClick={()=>setActiveMenu('gradient')} className={`py-3.5 px-3 font-medium transition relative text-scondary ${activeMenu==='gradient' ? "before:content-[''] before:w-full before:left-0 before:top-full before:h-[2px] before:bg-blue-500 before:-translate-y-[2px] before:absolute text-blue-500" : 'hover:text-black' }`}>Gradient</button>
                    <button onClick={()=>setActiveMenu('projects')} className={`py-3.5 px-3 font-medium transition relative text-scondary ${activeMenu==='projects' ? "before:content-[''] before:w-full before:left-0 before:top-full before:h-[2px] before:bg-blue-500 before:-translate-y-[2px] before:absolute text-blue-500" : 'hover:text-black' }`}>Projects</button>
                    <button onClick={()=>setActiveMenu('collections')} className={`py-3.5 px-3 font-medium transition relative text-scondary ${activeMenu==='collections' ? "before:content-[''] before:w-full before:left-0 before:top-full before:h-[2px] before:bg-blue-500 before:-translate-y-[2px] before:absolute text-blue-500" : 'hover:text-black' }`}>Collections</button>
                </div>
                <div className="p-6">
                    {activeMenu==='info' && (
                        <Fragment>
                            <label htmlFor="_name" className="text-sm font-medium mb-2 block">Name</label>
                            <input value={dataSave.name} onChange={(e)=>setDataSave({ ...dataSave, name: e.target.value })} id="_name" type="text" name="name" className="border border-gray-300 w-full px-4 py-3 text-[15px] focus:border-blue-500 outline-none transition hover:border-gray-400 rounded-xl font-medium" placeholder="My new gradient"/>
                            <label htmlFor="_description" className="text-sm font-medium mb-2 mt-3 block">Description</label>
                            <textarea onChange={(e)=>setDataSave({ ...dataSave, description: e.target.value })} value={dataSave.description} name="" id="" className="border border-gray-300 w-full px-4 py-3 text-[15px] focus:border-blue-500 outline-none transition hover:border-gray-400 rounded-xl font-medium resize-none h-[84px]"></textarea>
                            <div className="mt-1.5">
                                <p className="text-sm font-medium mb-2">Tags</p>
                                <div className={`relative border text-[15px] rounded-lg ${showAddTag ? `border-x-blue-500 border-t-blue-500 ${valueTag ? 'border-b-0 rounded-bl-none rounded-br-none' : 'border-b-blue-500'}` : 'hover:border-gray-400 border-gray-300'}`}>
                                    <div className="p-2 flex flex-wrap gap-2">
                                        {dataSave.tags.map((tag,i)=>(
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
                                    <div onClick={()=>{setDataSave(before=>({...before, tags: [...before.tags,valueTag]}));setValueTag('')}} className="absolute bg-white outline outline-[1px] p-1.5 w-full outline-blue-500 top-full rounded-bl-lg rounded-br-lg max-h-[143px] overflow-auto hide-scrollbar">
                                        <div className="hover:bg-gray-100 px-3 py-1 rounded cursor-pointer">Add {valueTag}</div>
                                    </div>
                                    )}
                                </div>
                            </div>
                        </Fragment>
                    )}
                    {activeMenu==='gradient' && (
                    <Fragment>
                        <div style={{ backgroundImage: getGradientPreview() }} className="w-full rounded-xl h-[104px] lg:h-[124px]"></div>
                        <div style={{ backgroundImage: getGradientPreview() }} className="relative h-3 rounded-full my-6">
                            {colors.map((obj,i)=>(
                            <input onChange={(e)=>handleOnChange(e,i)} value={obj.position} min={0} max={100} onFocus={()=>setFocusColor(colors[i])} key={i} data-color={obj.color} data-class={`s${i}`} type="range" className={`w-full s${i} absolute appearance-none bg-transparent -translate-y-[15%] range-gradient focus-within:border-red-100 pointer-events-none outline-none ${focusColor.color===obj.color&&'z-10'}`}/>
                            ))}
                        </div>
                        <div className="flex gap-3 mb-4">
                            <div className="flex-1 order-2">
                                <div className="flex items-center justify-between mb-2.5">
                                    <label htmlFor="colorActive_" className="text-sm font-medium block">Color</label>
                                    {colors.length > 2 && (
                                    <button onClick={handleRemoveColor} className="text-sm text-blue-500 hover:underline">Remove</button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input id="color_" onChange={handleChangeColor} value={`#${focusColor.color.toUpperCase()}`} placeholder={`#${focusColor.color.toUpperCase()}`} type="text" className="w-full border outline-none border-gray-300 hover:border-gray-400 transition focus:border-blue-500 px-4 py-2.5 rounded-lg"/>
                                    <div onClick={()=>setShowPicker(true)} style={{ backgroundColor: `#${colors[focusColor.index].color}` }} className="w-[30px] h-[30px] rounded absolute top-2 right-2 cursor-pointer btn-ref-picker-gradient"></div>
                                    {showPicker && (
                                    <ColorPickerRelative width={272} onChange={handleChangePicker} setState={setShowPicker} color={colors[focusColor.index].color} targetClass={'btn-ref-picker-gradient'}/>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 order-1">
                                <label htmlFor="position_" className="text-sm font-medium mb-3 block">Position</label>
                                <div className="relative">
                                    <input id="position_" onChange={e=>replacePosition(e.target.value.replace('%',''),focusColor.index)} value={`${focusColor.position}%`} type="text" className="w-full border outline-none border-gray-300 hover:border-gray-400 transition focus:border-blue-500 px-4 py-2.5 rounded-lg text-center font-medium"/>
                                    <button ref={btnMorePosition} onClick={()=>dispatch(setDataMenuMore({ width: 150, elementRef: btnMorePosition.current, Children: menuMorePosition }))} className={`absolute right-0 top-0 border rounded-tr-lg rounded-br-lg border-y-transparent border-r-transparent hover:border-gray-400 transition h-full px-1.5`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label htmlFor="rotation_" className="text-sm font-medium mb-3 block">Rotation</label>
                                <div className="relative">
                                    <input id="rotation_" onChange={handleChangeRotation}  value={`${rotation}°`} type="text" className="w-full border outline-none border-gray-300 hover:border-gray-400 transition focus:border-blue-500 px-4 py-2.5 rounded-lg text-center font-medium"/>
                                    <button ref={btnRotationRef} onClick={()=>dispatch(setDataMenuMore({ width: 150, elementRef: btnRotationRef.current, Children: menuMoreRotation }))} className={`absolute right-0 top-0 border rounded-tr-lg rounded-br-lg border-y-transparent border-r-transparent hover:border-gray-400 transition h-full px-1.5`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="relative flex-1">
                                <p className="text-sm font-medium mb-3">Type</p>
                                <div className={`border divide-gray-300 rounded-tl-lg rounded-tr-lg cursor-pointer border-gray-300 transition relative ${!showMoreType && 'hover:border-gray-400 rounded-lg'}`}>
                                    <div onClick={()=>setShowMoreType(state=>!state)} className="flex px-4 py-2.5 items-center justify-between">
                                        <p className="font-medium first-letter:uppercase">{type}</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    {showMoreType && (
                                    <Fragment>
                                        <div onClick={()=>setShowMoreType(false)} className="fixed top-0 left-0 w-screen h-screen cursor-auto"></div>
                                        <div className="p-2 absolute ring-1 ring-gray-300 w-full z-10 bg-white rounded-bl-lg rounded-br-lg">
                                            <div onClick={()=>{setType('linear');setShowMoreType(false)}} className={`px-2.5 py-1 mb-1 rounded cursor-pointer ${type==='linear' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                                <span className="font-medium text-sm">Linear</span>
                                                {type==='linear' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                )}
                                            </div>
                                            <div onClick={()=>{setType('radial');setShowMoreType(false)}} className={`px-2.5 py-1 rounded cursor-pointer ${type==='radial' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                                <span className="font-medium text-sm">Radial</span>
                                                {type==='radial' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                )}
                                            </div>
                                        </div>
                                    </Fragment>
                                    )}
                                </div>
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
                    <button onClick={handleSaveGradient} className="h-[46px] text-center font-bold bg-blue-500 hover:bg-blue-600 transition text-white w-full block rounded-xl">{loading==='save' ? <Spinner/> : 'Save'}</button>
                </div>
            </div>
        </ContainerPopup>
    )
}