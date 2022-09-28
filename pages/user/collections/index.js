import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { CollectionSaves, DashboardLoading, DashboardSearch, DashboardTemplate } from "../../../components";
import { colorsGroup, GetToken, stylesPalette } from "../../../lib";
import { fetchMoreCollectionsDashboard, selectDashboardCollections, selectDashboardCollectionsPage, selectLoadingFetchMoreDashboardCollections, setDashboardCollections } from "../../../slices/dashboardSlice";
import { wrapper } from "../../../store";

export default function Collections(){
    const dispatch = useDispatch();
    const collections = useSelector(selectDashboardCollections);
    const collectionsPage = useSelector(selectDashboardCollectionsPage);
    const loadingFetch = useSelector(selectLoadingFetchMoreDashboardCollections);
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
    const fetchCollections = () => {
        dispatch(fetchMoreCollectionsDashboard(parseInt(collectionsPage)+1));
    }
    return (
        <DashboardTemplate>
            <DashboardSearch title={'Collections'} filtersMenu={filtersMenu} handleSearch={handleSearch}/>
            {collections.data.length > 0 ? (
            <InfiniteScroll
                dataLength={collections.data.length}
                hasMore={true}
                next={fetchCollections}
            >
                <div className="grid gap-x-9 mt-10 gap-y-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                    {collections.data.map(collection=>(
                        <CollectionSaves data={collection} key={collection.id}/>
                    ))}
                </div>
            </InfiniteScroll>
            ) : (
            <div className="h-[calc(100vh-60px-60px-36px)] md:h-[calc(100vh-60px-80px-36px)] flex flex-col gap-4 items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
                <p className="text-[15px]">You {"don't"} have any collection yet.</p>
            </div>
            )}
            {loadingFetch && (
            <DashboardLoading/>
            )}
        </DashboardTemplate>
    )
}

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    try {
        const dataCollections = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/collections/feed?page=1`,null,{
            headers: {
                Authorization: `bearer ${GetToken(ctx)}`
            }
        })
        store.dispatch(setDashboardCollections(dataCollections.data));
    } catch (error) {
        return { notFound: true }
    }
})