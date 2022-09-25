import nookies from 'nookies';
import axios from 'axios';

export default async function Authorization(ctx){
    let token;
    if (ctx) {
        const cookies = nookies.get(ctx);
        token = cookies.token;
    }else {
        const cookies = nookies.get(null);
        token = cookies.token;
    }
    if (!token) {
        return null;
    }else {
        try {
            const user = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/users-permissions/user/getMe`,{
                headers: {
                    Authorization: `bearer ${token}`
                }
            });
            return user.data;
        } catch (error) {
            return null;
        }
    }
}