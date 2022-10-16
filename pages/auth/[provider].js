import axios from "axios"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function Auth(){
    const { provider, access_token } = useRouter().query;
    useEffect(()=>{
        const request = async () => {
            const req = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/auth/${provider}/callback?access_token=${access_token}`);
            console.log(req)
        }
        request();
    },[])
    return (
        <div>Hello</div>
    )
}