import Spinner from "./Spinner";

export default function DashboardLoading(){
    return (
        <div className="pt-[100px] pb-[60px]">
            <Spinner w={11} h={11}/>
        </div>
    )
}