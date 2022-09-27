import { getRandomColor } from "../lib";

export default function ColorPicker(){
    return null;
}

export function getServerSideProps(){
    return {
        redirect: {
            destination: `/${getRandomColor(1)}`
        }
    }
}