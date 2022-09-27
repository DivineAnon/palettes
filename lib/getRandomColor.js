import randomColor from "randomcolor";

export default function getRandomColor(count){
    return randomColor({ count }).map(color=>color.slice(1)).join('-');
}