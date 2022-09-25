
export default function ContainerPopup({ children, remove }){
    const removeAll = (e) => {
        if (e.target.classList.contains('exit')){
            remove(100);
        }
    }
    return (
        <div onClick={removeAll} className="left-0 top-0 fixed exit w-full sm:flex sm:items-center sm:justify-center h-screen bg-black/30 z-[90]">
            {children}
        </div>
    )
}