import { getRandomColor, getRandomRangeNumber } from "../../lib";

export default function GradientPalette(){
    return null;
}

export function getServerSideProps(){
    return {
        redirect: {
            destination: `/gradient-palette/${getRandomColor(2)}/?number=${getRandomRangeNumber(5,10)}`
        }
    }
}