import { getRandomColor } from "../../lib";

export default function GradientMaker(){
    return null;
}

export function getServerSideProps(){
    return {
        redirect: {
            destination: `/gradient-maker/${getRandomColor(2)}`
        }
    }
}