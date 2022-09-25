import Head from "next/head";
import Notif from "./Notif";
import PopUp from "./PopUp";

export default function Layout({ children, title }){
    return (
        <>
        <Head>
            <title>{title}</title>
        </Head>
        <div className="select-none">
            <PopUp/>
            {children}
            <Notif/>
        </div>
        </>
    )
}