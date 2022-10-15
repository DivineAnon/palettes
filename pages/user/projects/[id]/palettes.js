import axios from "axios";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLoading, DashboardLoadingSearch, PaletteDashboard, PCSearchTemplate, PCTemplate } from "../../../../components";
import { colorsGroup, GetToken, stylesPalette } from "../../../../lib";
import { selectDetailDashboardProject, selectDetailDashboardProjectPalettes, setDetailDashboardProject, setDetailDashboardProjectPalettes } from "../../../../slices/dashboardSlice";
import { setDataPopupProject, setIdDeleteProject } from "../../../../slices/popupSlice";
import { wrapper } from "../../../../store";

export default function ProjectPalettes(){
    const project = useSelector(selectDetailDashboardProject);
    const palettes = useSelector(selectDetailDashboardProjectPalettes);
    const dispatch = useDispatch();
    const [query,setQuery] = useState([]);
    const [loadingFetchSearch,setLoadingFetchSearch] = useState(false);
    const [loadingFetch,setLoadingFetch] = useState(false);
    const { id } = useRouter().query;
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
    const filtersMenu = () => (
        <section id="menuContainer" className="p-4">
            <div className="mb-5">
                <h1 className="text-sm font-semibold mb-3.5">Style</h1>
                <div className="flex flex-wrap gap-2">
                    {stylesPalette.filter(data=>!data.value.includes('Colors')).map((data,i)=>(
                        <div key={i} onClick={()=>handleAddQuery({ data, type: 'styles' })} className={`h-8 px-3 rounded-lg border text-sm font-medium flex items-center transition cursor-pointer ${query.filter(q=>q.type==='styles').map(q=>q.data.value).includes(data.value) ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`}>{data.value}</div>
                    ))}
                </div>
            </div>
            <div className="mb-5">
                <h1 className="text-sm font-semibold mb-3.5">Color</h1>
                <div className="flex flex-wrap gap-2">
                    {colorsGroup.map((data,i)=>(
                        <div key={i} onClick={()=>handleAddQuery({ data, type: 'colors' })} className={`h-8 px-3 rounded-lg border text-sm font-medium flex items-center transition cursor-pointer gap-2 ${query.filter(q=>q.type==='colors').map(q=>q.data.value).includes(data.value) ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`}>
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
                        <div key={i} onClick={()=>handleAddQuery({ data, type: 'styles' })} className={`h-8 px-3 rounded-lg border text-sm font-medium flex items-center transition cursor-pointer ${query.filter(q=>q.type==='styles').map(q=>q.data.value).includes(data.value) ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`}>{data.value}</div>
                    ))}
                </div>
            </div>
        </section>
    )
    const handleAddQuery = (q) => {
        const filteredSearch = query.filter(data=>data.type!=='search');
        setQuery(query=>filteredSearch.map(data=>data.data.value).includes(q.data.value) ? [...query.filter(q=>q.type==='search'),...filteredSearch.filter(data=>data.data.value!==q.data.value)] : [...query,q]);
    }
    const handleChangeSearch = (e) => {
        setQuery(query=>query.filter(data=>data.type!=='search'));
        if (e.target.value) {
            setQuery(query=>[...query,{ type: 'search', value: e.target.value }]);
        }else {
            fetchPalettesSearch(query.filter(data=>data.type!=='search'));
        }
    }
    const handleSearch = (e) => {
        e.preventDefault();
        if (e.target[0].value) {
            setQuery(query=>query.filter(data=>data.type!=='search'));
            setQuery(query=>[...query,{ type: 'search', value: e.target[0].value }]);
            fetchPalettesSearch(query);
        }
    }
    const handleRemoveSearch = () => {
        const newQuery = query.filter(data=>data.type!=='search');
        setQuery(newQuery);
        fetchPalettesSearch(newQuery);
    }
    const getQuery = (query,page) => {
        const styles = stylesPalette.filter(data=>query.filter(data=>data.type==='styles').map(q=>q.data.value).includes(data.value));
        const colors = query.filter(data=>data.type==='colors');
        const search = query.find(query=>query.type==='search');
        const queryList = [`page=${page}`];
        if (styles.length>0) {
            queryList.push(`styles=${styles.map(data=>data.value).join(',')}`);
        }
        if (colors.length>0) {
            queryList.push(`colors=${colors.map(data=>data.data.value).join(',')}`);
        }
        if (search) {
            queryList.push(`search=${search.value}`);
        }
        return queryList.join('&');
    }
    const fetchPalettesSearch = async (query) => {
        setLoadingFetchSearch(true);
        const { data: { project, palettes } } = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/projects/detail/${id}?view=palettes&${getQuery(query,1)}`,{
            headers: {
                Authorization: `bearer ${GetToken()}`
            }
        })
        setLoadingFetchSearch(false);
        dispatch(setDetailDashboardProjectPalettes(palettes));
    }
    const fetchPalettes = async () => {
        setLoadingFetch(true);
        const { data: { project, palettes: newPalettes } } = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/projects/detail/${id}?view=palettes&${getQuery(query,parseInt(palettes.meta.pagination.page)+1)}`,{
            headers: {
                Authorization: `bearer ${GetToken()}`
            }
        })
        setLoadingFetch(false);
        dispatch(setDetailDashboardProjectPalettes({ ...palettes, data: palettes.data.concat(newPalettes.data), meta: newPalettes.meta }));
    }
    return (
        <PCTemplate name={project.name} projects={[project]}>
            <PCSearchTemplate name={project.name} fetchData={fetchPalettesSearch} handleRemoveSearch={handleRemoveSearch} handleChangeSearch={handleChangeSearch} handleSearch={handleSearch} filtersMenu={filtersMenu} title={`Palettes (${palettes?.count})`} menuMore={menuMore} query={query}/>                  
            {palettes?.data.length>0 || loadingFetchSearch ? (
                loadingFetchSearch ? (
                    <div className="grid gap-x-9 mt-10 gap-y-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(id=>(
                        <DashboardLoadingSearch key={id}/>
                    ))}
                    </div>
                ) : (
                <InfiniteScroll
                    dataLength={palettes.data.length}
                    hasMore={true}
                    next={fetchPalettes}
                >
                    <div className="grid gap-x-9 mt-10 gap-y-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                        {palettes.data.map((palette,i)=>(
                            <PaletteDashboard data={palette} key={i} pc={true}/>
                        ))}
                    </div>
                </InfiniteScroll>
                )
            ) : (
                query.length > 0 ? (
                <div className="h-[calc(100vh-60px-60px-76px)] md:h-[calc(100vh-60px-80px-76px)] flex flex-col gap-4 items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14">
                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[15px]">No plaettes found</p>
                    <button onClick={()=>{setQuery([]);fetchPalettesSearch([])}} className="text-blue-500 hover:underline text-[15px]">Clear filters</button>
                </div>
                ) : (
                <div className="h-[calc(100vh-60px-60px-76px)] md:h-[calc(100vh-60px-80px-76px)] flex flex-col gap-4 items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
                    </svg>
                    <p className="text-[15px]">You {"don't"} have any palette yet.</p>
                </div>
                )
            )}
            {loadingFetch && (
            <DashboardLoading/>
            )}
        </PCTemplate>
    )
}

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    try {
        const { id } = ctx.query;
        const { data: { project, palettes } } = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/projects/detail/${id}?view=palettes&page=1&init=true`,{
            headers: {
                Authorization: `bearer ${GetToken(ctx)}`
            }
        });
        store.dispatch(setDetailDashboardProject(project));
        store.dispatch(setDetailDashboardProjectPalettes(palettes));
    } catch (error) {
        return { notFound: true }
    }
})