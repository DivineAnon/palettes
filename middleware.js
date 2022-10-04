import { NextResponse } from "next/server";

export function middleware(req){
    if (req.nextUrl.pathname==='/palettes') {
        return NextResponse.redirect(new URL('/palettes/trending', req.url));
    }else if (req.nextUrl.pathname==='/user') {
        if (req.cookies.get('token')) {
            return  NextResponse.redirect(new URL('/user/palettes', req.url));
        }else {
            return  NextResponse.redirect(new URL('/', req.url));
        }
    }else if (req.nextUrl.pathname==='/account'){
        if (req.cookies.get('token')) {
            return  NextResponse.redirect(new URL('/account/general', req.url));
        }else {
            return NextResponse.rewrite(new URL('/404', req.url))
        }
    }else if (req.nextUrl.pathname.split('/').slice(1).length===3 && req.nextUrl.pathname.split('/').slice(1)[0] === 'user' && req.nextUrl.pathname.split('/').slice(1)[1]==='projects'){
        if (!isNaN(req.nextUrl.pathname.split('/').slice(1)[2])) {
            return  NextResponse.redirect(new URL(`/user/projects/${req.nextUrl.pathname.split('/').slice(1)[2]}/palettes`, req.url));
        }else {
            return NextResponse.rewrite(new URL('/404', req.url))
        }
    }else if (req.nextUrl.pathname.split('/').slice(1).length===3 && req.nextUrl.pathname.split('/').slice(1)[0] === 'user' && req.nextUrl.pathname.split('/').slice(1)[1]==='collections'){
        if (!isNaN(req.nextUrl.pathname.split('/').slice(1)[2])) {
            return  NextResponse.redirect(new URL(`/user/collections/${req.nextUrl.pathname.split('/').slice(1)[2]}/palettes`, req.url));
        }else {
            return NextResponse.rewrite(new URL('/404', req.url))
        }
    }
}
