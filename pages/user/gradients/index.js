import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLoading, DashboardSearch, DashboardTemplate, PaletteGradientSaves } from "../../../components";
import { colorsGroup, GetToken, stylesPalette } from "../../../lib";
import { fetchMoreGradientsDashboard, selectDashboardGradients, selectDashboardGradientsPage, selectLoadingFetchMoreDashboardGradients, setDashboardGradients } from "../../../slices/dashboardSlice";
import { wrapper } from "../../../store";

export default function GradientsDashboard(){
    const dispatch = useDispatch();
    const gradients = useSelector(selectDashboardGradients);
    const gradientsPage = useSelector(selectDashboardGradientsPage);
    const loadingFetch = useSelector(selectLoadingFetchMoreDashboardGradients);
    const fetchGradients = async () => {
        dispatch(fetchMoreGradientsDashboard(parseInt(gradientsPage)+1));
    }
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
    return (
        <DashboardTemplate>
            <DashboardSearch title={'Gradients'} filtersMenu={filtersMenu} handleSearch={handleSearch}/>
            {gradients.data.length > 0 ? (
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
            ) : (
            <div className="h-[calc(100vh-60px-60px-36px)] md:h-[calc(100vh-60px-80px-36px)] flex flex-col gap-4 items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <p className="text-[15px]">You {"don't"} have any gradient yet.</p>
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