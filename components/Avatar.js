import Image from "next/image"
import { Fragment } from "react"

export default function Avatar({ className, user }){
    return (
        <Fragment>
            {!user.avatar ? (
            <div className={`w-[140px] h-[140px] rounded-full bg-blue-100 flex items-center justify-center ${className}`}>
                <span className="text-6xl font-extrabold uppercase">{user.fullname.charAt(0)}</span>
            </div>
            ) : (
            <Image alt="avatar" width={140} height={140} className={`object-center object-cover rounded-full ${className}`} src={user.avatar.url} />
            )}
        </Fragment>
    )
}