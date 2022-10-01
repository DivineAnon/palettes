import axios from "axios";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLoading, DashboardLoadingSearch, DashboardSearch, DashboardTemplate, PaletteGradientSaves } from "../../../components";
import { colorsGroup, GetToken, stylesPalette } from "../../../lib";
import { fetchMoreGradientsDashboard, selectDashboardGradients, selectDashboardGradientsPage, selectLoadingFetchMoreDashboardGradients, setDashboardGradients } from "../../../slices/dashboardSlice";
import { wrapper } from "../../../store";

export default function GradientsDashboard(){
    const dispatch = useDispatch();
    const gradients = useSelector(selectDashboardGradients);
    const gradientsPage = useSelector(selectDashboardGradientsPage);
    const loadingFetch = useSelector(selectLoadingFetchMoreDashboardGradients);
    const [loadingFetchSearch,setLoadingFetchSearch] = useState(false);
    const [query,setQuery] = useState([]);
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
    const fetchGradients = async () => {
        dispatch(fetchMoreGradientsDashboard(getQuery(query,parseInt(gradientsPage)+1)));
    }
    const handleAddQuery = (q) => {
        const filteredSearch = query.filter(data=>data.type!=='search');
        setQuery(query=>filteredSearch.map(data=>data.data.value).includes(q.data.value) ? [...query.filter(q=>q.type==='search'),...filteredSearch.filter(data=>data.data.value!==q.data.value)] : [...query,q]);
    }
    const handleSearch = (e) => {
        e.preventDefault();
        if (e.target[0].value) {
            setQuery(query=>query.filter(data=>data.type!=='search'));
            setQuery(query=>[...query,{ type: 'search', value: e.target[0].value }]);
            fetchGradientsSearch(query);
        }
    }
    const handleChangeSearch = (e) => {
        setQuery(query=>query.filter(data=>data.type!=='search'));
        if (e.target.value) {
            setQuery(query=>[...query,{ type: 'search', value: e.target.value }]);
        }else {
            fetchGradientsSearch(query.filter(data=>data.type!=='search'));
        }
    }
    const handleRemoveSearch = () => {
        const newQuery = query.filter(data=>data.type!=='search');
        setQuery(newQuery);
        fetchGradientsSearch(newQuery);
    }
    const fetchGradientsSearch = async (query) => {
        setLoadingFetchSearch(true);
        const gradients = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/saves-gradients/feed?${getQuery(query,1)
        }`,{
            headers: {
                Authorization: `bearer ${GetToken()}`
            }
        })
        setLoadingFetchSearch(false);
        dispatch(setDashboardGradients(gradients.data));
    }
    const filtersMenu = () => (
        <section id="menuContainer" className="p-4">
            <div className="mb-5">
                <h1 className="text-sm font-semibold mb-3.5">Style</h1>
                <div className="flex flex-wrap gap-2">
                    {stylesPalette.filter(data=>!data.value.includes('Colors') && data.value!=='Gradient').map((data,i)=>(
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
    return (
        <DashboardTemplate>
            <DashboardSearch title={'Gradients'} fetchData={fetchGradientsSearch} handleRemoveSearch={handleRemoveSearch} handleChangeSearch={handleChangeSearch} query={query} filtersMenu={filtersMenu} handleSearch={handleSearch}/>
            {gradients.data.length > 0 || loadingFetchSearch ? (
                loadingFetchSearch ? (
                    <div className="grid gap-x-9 mt-10 gap-y-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(id=>(
                            <DashboardLoadingSearch key={id}/>
                        ))}
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={gradients.data.length}
                        hasMore={true}
                        next={fetchGradients}
                    >
                        <div className="grid gap-x-9 mt-10 gap-y-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                            {gradients.data.map((data,i)=>(
                                <PaletteGradientSaves data={data} key={i}/>
                            ))}
                        </div>
                    </InfiniteScroll>
                )
            ) : (
            query.length > 0 ? (
            <div className="h-[calc(100vh-60px-60px-36px)] md:h-[calc(100vh-60px-80px-36px)] flex flex-col gap-4 items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                </svg>
                <p className="text-[15px]">No gradients found</p>
                <button onClick={()=>{setQuery([]);fetchGradientsSearch([])}} className="text-blue-500 hover:underline text-[15px]">Clear filters</button>
            </div>
            ) : (
            <div className="h-[calc(100vh-60px-60px-36px)] md:h-[calc(100vh-60px-80px-36px)] flex flex-col gap-4 items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <p className="text-[15px]">You {"don't"} have any gradient yet.</p>
            </div>
            )
            )}
            {loadingFetch && (
            <DashboardLoading/>
            )}
        </DashboardTemplate>
    )
}

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    try {
        const dataGradients = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/saves-gradients/feed?page=1`,{
            headers: {
                Authorization: `bearer ${GetToken(ctx)}`
            }
        })
        store.dispatch(setDashboardGradients(dataGradients.data));
    } catch (error) {
        return { notFound: true }
    }
})