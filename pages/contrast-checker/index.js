import { getRandomColor } from "../../lib";

export default function ContrastChecker(){
    return null;
}

export function getServerSideProps(){
    return {
        redirect: {
            destination: `/contrast-checker/${getRandomColor(2)}`
        }
    }
}