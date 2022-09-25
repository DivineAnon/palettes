import { Layout, Header, Footer } from "../components";

export default function NotFound(){
    return (
        <Layout title={'Page Not Found - Palettes'}>
            <Header/>
            <div className="mt-[59px] py-[100px] text-center">
                <h1 className="font-black text-6xl mb-8">404</h1>
                <p className="text-xl">Page not found</p>
            </div>
            <Footer/>
        </Layout>
    )
}
