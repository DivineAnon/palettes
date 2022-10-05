import axios from "axios";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaletteGradientSaves, PCSearchTemplate, PCTemplate } from "../../../../components";
import { GetToken } from "../../../../lib";
import { selectDetailDashboardCollection, selectDetailDashboardCollectionGradients, setDetailDashboardCollection, setDetailDashboardCollectionGradients } from "../../../../slices/dashboardSlice";
import { setDataPopupCollection, setIdDeleteCollection } from "../../../../slices/popupSlice";
import { wrapper } from "../../../../store";

export default function CollectionGradients(){
    const collection = useSelector(selectDetailDashboardCollection);
    const gradients = useSelector(selectDetailDashboardCollectionGradients);
    const dispatch = useDispatch();
    const menuMore = ()=> (
        <Fragment>
            <section>
                <div onClick={()=>handleMenuMore('edit')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                    <span className="md:text-sm font-medium">Edit gradient</span>
                </div>
                <div onClick={()=>handleMenuMore('delete')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span className="md:text-sm font-medium">Delete gradient</span>
                </div>
            </section>
        </Fragment>
    )
    const handleMenuMore = (menu) => {
        if (menu==='edit') {
            dispatch(setDataPopupCollection(collection));
        }else if (menu==='delete') {
            dispatch(setIdDeleteCollection(collection.id));
        }
    }
    return (
        <PCTemplate name={collection.name} collections={[collection]}>
            <PCSearchTemplate name={collection.name} title={`Gradients (${gradients?.count})`} menuMore={menuMore}/>
            {gradients?.data.length > 0 ? (
            <div className="grid gap-x-9 mt-10 gap-y-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                {gradients.data.map((gradient,i)=>(
                    <PaletteGradientSaves data={gradient} key={i} pc={true}/>
                ))}
            </div>
            ) : (
            <div className="h-[calc(100vh-60px-60px-76px)] md:h-[calc(100vh-60px-80px-76px)] flex flex-col gap-4 items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <p className="text-[15px]">You {"don't"} have any gradient yet.</p>
            </div>
            )}
        </PCTemplate>
    )
}

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    try {
        const { id } = ctx.query;
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/collections/detail/${id}`,{
            page: 1,
            init: true,
            view: 'gradients'
        },{
            headers: {
                Authorization: `bearer ${GetToken(ctx)}`
            }
        })
        store.dispatch(setDetailDashboardCollection(data.collection));
        store.dispatch(setDetailDashboardCollectionGradients(data.gradients));
    } catch (error) {
        return { notFound: true }
    }
})
