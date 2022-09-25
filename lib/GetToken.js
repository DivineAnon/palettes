import nookies from 'nookies';

export default function GetToken(ctx){
    let token;
    if (ctx) {
        const cookies = nookies.get(ctx);
        token = cookies.token;
    }else {
        const cookies = nookies.get(null);
        token = cookies.token;
    }
    return token;
}