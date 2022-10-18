import axios from "axios";
import { serialize  } from "cookie";

export default async function handler(req, res){
    const { access_token, provider } = req.query;
    const request = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/auth/${provider}/callback?access_token=${access_token}`);
    res.setHeader('Set-Cookie', serialize('token', request.data.jwt, { path: '/', maxAge: 30 * 24 * 60 * 60 }));
    res.redirect('/');
}