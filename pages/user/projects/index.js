import axios from "axios";
import { useLayoutEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLoading, DashboardSearch, DashboardTemplate, ProjectSaves } from "../../../components";
import { Authorization, colorsGroup, GetToken, stylesPalette } from "../../../lib";
import { fetchMoreProjectsDashboard, selectDashboardProjects, selectDashboardProjectsPage, selectLoadingFetchMoreDashboardProjects, setDashboardProjects } from "../../../slices/dashboardSlice";

export default function Projects({ dataProjects }){
    const dispatch = useDispatch();
    const projects = useSelector(selectDashboardProjects);
    const projectsPage = useSelector(selectDashboardProjectsPage);
    const loadingFetch = useSelector(selectLoadingFetchMoreDashboardProjects);
    const handleSearch = (e) => {
        e.preventDefault();
        console.log(e.target[0].value)
    }
    const filtersMenu = () => (
        <section className="p-4">
            <div className="mb-5">
                <h1 className="text-sm font-semibold mb-3.5">Style</h1>
                <div className="flex flex-wrap gap-2">
                    {stylesPalette.filter(data=>!data.value.includes('Colors')).map((data,i)=>(
                        <div key={i} className="h-8 px-3 rounded-lg border text-sm font-medium flex items-center transition hover:border-gray-400 cursor-pointer">{data.value}</div>
                    ))}
                </div>
            </div>
            <div className="mb-5">
                <h1 className="text-sm font-semibold mb-3.5">Color</h1>
                <div className="flex flex-wrap gap-2">
                    {colorsGroup.map((data,i)=>(
                        <div key={i} className="h-8 px-3 rounded-lg border text-sm font-medium flex items-center transition hover:border-gray-400 cursor-pointer gap-2">
                            <div style={{ backgroundColor: data.hex }} className={`w-3 h-3 rounded-full ${data.value==='White' && 'border'}`}></div>
                            <span>{data.value}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h1 className="text-sm font-semibold mb-3.5">Number of colors</h1>
                <div className="flex flex-wrap gap-2">
                    {stylesPalette.filter(data=>data.value.includes('Colors')).map((data,i)=>(
                        <div key={i} className="h-8 px-3 rounded-lg border text-sm font-medium flex items-center transition hover:border-gray-400 cursor-pointer">{data.value}</div>
                    ))}
                </div>
            </div>
        </section>
    )
    const fetchProjects = () => {
        dispatch(fetchMoreProjectsDashboard(parseInt(projectsPage)+1));
    }
    useLayoutEffect(()=>{
        dispatch(setDashboardProjects(dataProjects));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <DashboardTemplate>
            <DashboardSearch title={'Projects'} handleSearch={handleSearch} filtersMenu={filtersMenu}/>
            {projects.data.length > 0 ? (
            <InfiniteScroll
                dataLength={projects.data.length}
                hasMore={true}
                next={fetchProjects}
            >
                <div className="grid gap-x-9 mt-10 gap-y-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                    {projects.data.map(project=>(
                        <ProjectSaves key={project.id} data={project}/>
                    ))}
                </div>
            </InfiniteScroll>
            ) : (
            <div className="h-[calc(100vh-60px-60px-36px)] md:h-[calc(100vh-60px-80px-36px)] flex flex-col gap-4 items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
                <p className="text-[15px]">You {"don't"} have any project yet.</p>
            </div>
            )}
            {loadingFetch && (
            <DashboardLoading/>
            )}
        </DashboardTemplate>
    )
}

export async function getServerSideProps(ctx){
    try {
        const dataProjects = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/projects/feed?page=1`,{
            headers: {
                Authorization: `bearer ${GetToken(ctx)}`
            }
        })
        return { props: { dataProjects: dataProjects.data } }
    } catch (error) {
        return { notFound: true }
    }
}