import axios from "axios";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaletteColorSaves, PCSearchTemplate, PCTemplate } from "../../../../components";
import { GetToken } from "../../../../lib";
import { selectDetailDashboardProject, selectDetailDashboardProjectColors, setDetailDashboardProject, setDetailDashboardProjectColors } from "../../../../slices/dashboardSlice";
import { setDataPopupProject, setIdDeleteProject } from "../../../../slices/popupSlice";
import { wrapper } from "../../../../store";

export default function ProjectColors(){
    const project = useSelector(selectDetailDashboardProject);
    const colors = useSelector(selectDetailDashboardProjectColors);
    const dispatch = useDispatch();
    const menuMore = ()=> (
        <Fragment>
            <section>
                <div onClick={()=>handleMenuMore('edit')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                    <span className="md:text-sm font-medium">Edit project</span>
                </div>
                <div onClick={()=>handleMenuMore('delete')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span className="md:text-sm font-medium">Delete Project</span>
                </div>
            </section>
        </Fragment>
    )
    const handleMenuMore = (menu) => {
        if (menu==='edit') {
            dispatch(setDataPopupProject(project));
        }else if (menu==='delete') {
            dispatch(setIdDeleteProject(project.id));
        }
    }
    return (
        <PCTemplate name={project.name} projects={[project]}>
            <PCSearchTemplate name={project.name} title={`Colors (${colors?.count})`} menuMore={menuMore}/>
            {colors?.data.length>0 ? (
            <div className="grid gap-x-9 mt-10 gap-y-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                {colors.data.map((color,i)=>(
                    <PaletteColorSaves data={color} key={i} pc={true}/>
                ))}
            </div>
            ) : (
            <div className="h-[calc(100vh-60px-60px-76px)] md:h-[calc(100vh-60px-80px-76px)] flex flex-col gap-4 items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" className="w-24 h-24" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M7.21.8C7.69.295 8 0 8 0c.109.363.234.708.371 1.038.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8zm.413 1.021A31.25 31.25 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
                    <path fillRule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448z"/>
                </svg>
                <p className="text-[15px]">You {"don't"} have any color yet.</p>
            </div>
            )}
        </PCTemplate>
    )
}

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    try {
        const { id } = ctx.query;
        const { data: { project, colors } } = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/projects/detail/${id}?view=colors&page=1&init=true`,{
            headers: {
                Authorization: `bearer ${GetToken(ctx)}`
            }
        });
        store.dispatch(setDetailDashboardProject(project));
        store.dispatch(setDetailDashboardProjectColors(colors));
    } catch (error) {
        return { notFound: true }
    }
})