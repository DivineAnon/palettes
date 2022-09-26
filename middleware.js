import { NextResponse } from "next/server";
const randomColor = require('randomcolor');

const getRandomRangeNumber = (min=2, max=10) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function middleware(req){
    if (req.nextUrl.pathname==='/palettes') {
        return NextResponse.redirect(new URL('/palettes/trending', req.url));
    }else if (req.nextUrl.pathname==='/generate') {
        // const hexSlug = randomColor({ count: 5 }).map(color=>color.replace('#','')).join('-');
        return NextResponse.redirect(new URL(`/${randomColor({ count: 5 }).map(color=>color.replace('#','')).join('-')}`, req.url));
    }else if (req.nextUrl.pathname==='/color-picker') {
        const color = randomColor().slice(1);
        return NextResponse.redirect(new URL(`/${color}`, req.url));
    }else if (req.nextUrl.pathname==='/user') {
        if (req.cookies.get('token')) {
            return  NextResponse.redirect(new URL('/user/palettes', req.url));
        }else {
            return  NextResponse.redirect(new URL('/', req.url));
        }
    }else if (req.nextUrl.pathname==='/gradient-palette'){
        const number = getRandomRangeNumber(5,10);
        const palette = randomColor({ count: 2 }).map(color=>color.slice(1)).join('-');
        return  NextResponse.redirect(new URL(`/gradient-palette/${palette}/?number=${number}`, req.url));
    }else if (req.nextUrl.pathname==='/gradient-maker'){
        const palette = randomColor({ count: 2 }).map(color=>color.slice(1)).join('-');
        return  NextResponse.redirect(new URL(`/gradient-maker/${palette}`, req.url));
    }else if (req.nextUrl.pathname==='/contrast-checker'){
        const palette = randomColor({ count: 2 }).map(color=>color.slice(1)).join('-');
        return  NextResponse.redirect(new URL(`/contrast-checker/${palette}`, req.url));
    }else if (req.nextUrl.pathname==='/account'){
        if (req.cookies.get('token')) {
            return  NextResponse.redirect(new URL('/account/general', req.url));
        }else {
            return NextResponse.rewrite(new URL('/404', req.url))
        }
    }
}