import axios from "axios";
import { useRouter } from "next/router";
import { useRef , useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetToken, usePushNotif,  } from "../lib";
import { addDashboardProject, updateDashboardProject } from "../slices/dashboardSlice";
import { closePopupProject, selectDataPopupProject } from "../slices/popupSlice";
import { addUserProject, selectUser, updateUserProject } from "../slices/userSlice";
import ContainerPopup from "./ContainerPopup";
import Spinner from "./Spinner";

export default function PopupCreateProject(){
    const dispatch = useDispatch();
    const dataPopupProject = useSelector(selectDataPopupProject);
    const user = useSelector(selectUser);
    const Router = useRouter();
    const elementRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ name: dataPopupProject.data ? dataPopupProject.data.name : '' });
    const handlePushNotif = usePushNotif();
    const handleChange = (e) => {
        setData({ [e.target.name]: e.target.value });
    }
    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (data.name) {
            if (dataPopupProject.data) {
                setLoading(true);
                const update = await axios.put(`${process.env.NEXT_PUBLIC_API}/api/projects/update/${dataPopupProject.data.id}`,{
                    data: {
                        name: data.name,
                    }
                }, {
                    headers: {
                        Authorization: `bearer ${GetToken()}`
                    }
                })
                const project = update.data;
                dispatch(updateUserProject(project));
                if (Router.pathname==='/user/projects') {
                    dispatch(updateDashboardProject(project));
                }
                setLoading(false);
                dispatch(closePopupProject())
                handlePushNotif({ text: 'Project updated succesfully!', className: 'bg-black', icon: 'checklist' });
            }else {
                setLoading(true);
                const create = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/projects/create`,{
                    data: {
                        name: data.name,
                        author: user.id
                    }
                },{
                    headers: {
                        Authorization: `bearer ${GetToken()}`
                    }
                })
                const project = create.data;
                dispatch(addUserProject(project));
                if (Router.pathname==='/user/projects') {
                    dispatch(addDashboardProject(project));
                }
                setLoading(false);
                dispatch(closePopupProject())
                handlePushNotif({ text: 'Project updated succesfully!', className: 'bg-black', icon: 'checklist' });
            }
        }
    }
    const removeBox = (time) => {
        elementRef.current.classList.remove('sm:animate-fadeIn');
        elementRef.current.classList.remove('animate-translateY');
        elementRef.current.classList.add('sm:animate-fadeOut');
        elementRef.current.classList.add('animate-translateY-reverse');
        const close = setTimeout(()=>{
            dispatch(closePopupProject())
        },time);
        return ()=> clearTimeout(close);
    }
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={elementRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[380px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl flex flex-col divide-y">
                <div className="p-3 relative">
                    <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 transition cursor-pointer p-1.5 rounded-lg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h1 className="font-semibold text-center">Create a project</h1>
                </div>
                <form onSubmit={handleCreateProject} method="post" className="divide-y">
                    <div className="p-6">
                        <label htmlFor="projectName_" className="block text-sm font-medium mb-3">Name</label>
                        <input id="projectName_" value={data.name} autoComplete="off" onChange={handleChange} name="name" type="text" required placeholder="My new project" className="border border-gray-300 w-full px-4 py-3 text-[15px] focus:border-blue-500 outline-none transition hover:border-gray-400 rounded-xl font-medium"/>
                    </div>
                    <div className="p-4">
                        <button className="h-[46px] text-center font-bold bg-blue-500 hover:bg-blue-600 transition text-white w-full block rounded-xl">{loading ? <Spinner/> : 'Save'}</button>
                    </div>
                </form>
            </div>
        </ContainerPopup>
    )
}