import { getRandomColor } from "../lib";

export default function Generate(){
    return null;
}

export function getServerSideProps(){
    return {
        redirect: {
            destination: `/${getRandomColor(5)}`
        }
    }
}