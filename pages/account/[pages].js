import { AvatarProfileEdit, Footer, Header, Layout, NotifRelative, Spinner } from "../../components";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from "react";
import { Authorization, ValidasiUsername, GetToken, ValidasiEmail, SkillsList, ValidasiContact, handlePushNotif } from "../../lib";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../slices/userSlice";
import { resetAvatarDelId, selectAvatarDelId } from "../../slices/globalSlice";

export default function Account({ dataUser }){
    const Router = useRouter();
    const { pages } = Router.query;
    const avatarDelID = useSelector(selectAvatarDelId);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [showCurrentPW, setShowCurrentPW] = useState(false);
    const [showNewPW, setShowNewPW] = useState(false);
    const [showAccountPW, setShowAccountPW] = useState(false);
    const [usernameInvalid, setUsernameInvalid] = useState(false);
    const [invalidUsernameMessage, setInvalidUsernameMessage] = useState(null);
    const [emailInvalid, setEmailInvalid] = useState(false);
    const [invalidEmailMessage, setInvalidEmailMessage] = useState(null);
    const [loading, setLoading] = useState(null);
    const [nullFullname, setNullFullname] = useState(false);
    const [dataProfile, setDataProfile] = useState({ fullname: dataUser.fullname, headline: dataUser.headline ? dataUser.headline : '', location: dataUser.location ? dataUser.location : '', skills: dataUser.skills ? dataUser.skills.split(',') : [], bio: dataUser.bio ? dataUser.bio : '', contact: dataUser.contact ? dataUser.contact : [] });
    const [dataGeneral, setDataGeneral] = useState({ username: dataUser.username, email: dataUser.email, password: '', newPassword: '' });
    const [skills, setSkills] = useState(SkillsList);
    const [showMoreSkills, setShowMoreSkills] = useState(false);
    const [showMoreContact, setShowMoreContact] = useState(false);
    const [invalidCurrentPW, setInvalidCurrentPW] = useState(null);
    const [invalidNewPW, setInvalidNewPW] = useState(null);
    const handleChangeDataProfile = (e) => {
        setDataProfile({ ...dataProfile, [e.target.name]: e.target.value });
    }
    const handleChangeDataGeneral = (e) => {
        setDataGeneral({ ...dataGeneral, [e.target.name]: e.target.value });
    }
    const removeSkill = (skill) => {
        const newSkills = dataProfile.skills.filter(data=>data!==skill);
        setDataProfile({ ...dataProfile, skills: newSkills });
        setSkills(SkillsList.filter(skill=>!newSkills.includes(skill)));
    }
    const addSkill = (skill) => {
        const newSkills = [...dataProfile.skills, skill];
        setDataProfile({ ...dataProfile, skills:  newSkills});
        setSkills(SkillsList.filter(skill=>!newSkills.includes(skill)));
    }
    const handleUnfocus = () => {
        setTimeout(()=>{
            setShowMoreSkills(false);
        },110)
    }
    const handleSaveUsername = async () => {
        if (!loading) {
            setLoading('username');
            setUsernameInvalid(false);
            setInvalidUsernameMessage(null);
            let res = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/users?filters[username][$eq]=${dataGeneral.username}`);
            setLoading(null);
            let isValid = ValidasiUsername(dataGeneral.username);
            if (res.data.length===0 || res.data[0].username===user.username) {
                if (res.data.length===0) {
                    if (!isValid) {
                        setUsernameInvalid(true);
                        setInvalidUsernameMessage("Must contain 4-25 letters, number or ._-");
                    }else {
                        let update = await axios.put(`${process.env.NEXT_PUBLIC_API}/api/users/${dataUser.id}`,{
                            username: dataGeneral.username,
                        },{
                            headers: {
                                Authorization: `bearer ${GetToken()}`
                            }
                        })
                        dispatch(setUser({ ...user, username: update.data.username }));
                        handlePushNotif({ text: 'Username updated successfully!', className: 'bg-black', icon: 'checklist' });
                    }
                } else {
                    handlePushNotif({ text: 'Username updated successfully!', className: 'bg-black', icon: 'checklist' });
                }
            }else {
                setUsernameInvalid(true);
                setInvalidUsernameMessage("This username is taken");                    
            }
        }
    }
    const handleSaveEmail = async () => {
        if (!loading) {
            setLoading('email');
            setEmailInvalid(false);
            setInvalidEmailMessage(null);
            const isValid = ValidasiEmail(dataGeneral.email);
            let res = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/users/?filters[email][$eq]=${dataGeneral.email}`);
            setLoading(null);
            if (res.data.length===0 || res.data[0].email===user.email) {
                if (res.data.length===0) {
                    if (!isValid) {
                        setEmailInvalid(true);
                        setInvalidEmailMessage("This is not a valid email");
                    }else {
                        let update = await axios.put(`${process.env.NEXT_PUBLIC_API}/api/users/${dataUser.id}`,{
                            email: dataGeneral.email,
                        },{
                            headers: {
                                Authorization: `bearer ${GetToken()}`
                            }
                        })
                        dispatch(setUser({ ...user, email: update.data.email }));
                        handlePushNotif({ text: 'Email updated successfully!', className: 'bg-black', icon: 'checklist' });
                    }
                } else {
                    handlePushNotif({ text: 'Email updated successfully!', className: 'bg-black', icon: 'checklist' });
                }
            }else {
                setEmailInvalid(true);
                setInvalidEmailMessage("This email is already registered");    
            }
        }
    }
    const handleSavePassword = async () => {
        if (!loading) {
            setLoading('password');
            setInvalidCurrentPW(null);
            setInvalidNewPW(null);
            if (dataGeneral.newPassword.length<8) {
                setInvalidNewPW('Min 8 characters');
            }else {
                const change = await axios.put(`${process.env.NEXT_PUBLIC_API}/api/users-permissions/user/change-password`,{
                    data: {
                        password: dataGeneral.password,
                        newPassword: dataGeneral.newPassword,
                        userId: user.id,
                    }
                },{
                    headers: {
                        Authorization: `bearer ${GetToken()}`
                    }
                })
                if (change.data) {
                    setDataGeneral({ ...dataGeneral, password: '', newPassword: '' });
                    handlePushNotif({ text: 'Password updated successfully!', className: 'bg-black', icon: 'checklist' });
                }else {
                    setInvalidCurrentPW('This is not the current password');
                }
            }
            setLoading(null);
        }
    }
    const handleSaveDataProfile = async () => {
        if (!loading) {
            setNullFullname(false);
            if (!dataProfile.fullname) {
                setNullFullname(true);
            }else {
                setLoading('profile');
                if (avatarDelID.length!==0) {
                    for (let i = 0; i < avatarDelID.length; i++) {
                        const del = await axios.delete(`${process.env.NEXT_PUBLIC_API}/api/upload/files/${avatarDelID[i]}`,{
                            headers: {
                                Authorization: `bearer ${GetToken()}`
                            }
                        })
                    }
                    dispatch(resetAvatarDelId());
                }
                let update = await axios.put(`${process.env.NEXT_PUBLIC_API}/api/users/${dataUser.id}`,{
                    fullname: dataProfile.fullname,
                    headline: dataProfile.headline,
                    location: dataProfile.location,
                    bio: dataProfile.bio,
                    skills: dataProfile.skills.join(', '),
                    contact: ValidasiContact(dataProfile.contact).length>0 ? ValidasiContact(dataProfile.contact) : null,
                },{
                    headers: {
                        Authorization: `bearer ${GetToken()}`
                    }
                })
                setLoading(null);
                dispatch(setUser({ ...user, fullname: update.data.fullname, headline: update.data.headline, location: update.data.location, bio: update.data.bio, skills: update.data.skills, contact: update.data.contact }));
                handlePushNotif({ text: 'Profile updated successfully!', className: 'bg-black', icon: 'checklist' });
            }
        }
    }
    const handleRemoveContact = (type) => {
        setDataProfile({ ...dataProfile, contact: dataProfile.contact.filter(contact=>contact.type!==type) });
    }
    const handleAddContact = (type) => {
        if (!dataProfile.contact.map(data=>data.type).includes(type)) {
            if (type==='website') {
                setDataProfile({ ...dataProfile, contact: [...dataProfile.contact, { type: 'website', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-globe group-hover:text-blue-500" viewBox="0 0 16 16"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/></svg>`, placeholder: 'https://www.website.com', value: '' }] });
            }
            if (type==='email') {
                setDataProfile({ ...dataProfile, contact: [...dataProfile.contact, { type: 'email', icon: ` <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-at group-hover:text-blue-500" viewBox="0 0 16 16"><path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"/></svg>`, placeholder: 'email@me.com', value: '' }] });
            }
            if (type==='twitter') {
                setDataProfile({ ...dataProfile, contact: [...dataProfile.contact, { type: 'twitter', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-twitter group-hover:text-blue-500" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg>`, placeholder: 'Username', value: '' }] });
            }
            if (type==='facebook') {
                setDataProfile({ ...dataProfile, contact: [...dataProfile.contact, { type: 'facebook', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-facebook group-hover:text-blue-500" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>', placeholder: 'https://www.facebook.com/page', value: '' }] });
            }
            if (type==='whatsapp') {
                setDataProfile({ ...dataProfile, contact: [...dataProfile.contact, { type: 'whatsapp', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-whatsapp group-hover:text-blue-500" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>`, placeholder: '+62xxxxxx', value: '' }] });
            }
            if (type==='instagram') {
                setDataProfile({ ...dataProfile, contact: [...dataProfile.contact, { type: 'instagram', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-instagram group-hover:text-blue-500" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg>`, placeholder: 'Username', value: '' }] });
            }
            if (type==='youtube') {
                setDataProfile({ ...dataProfile, contact: [...dataProfile.contact, { type: 'youtube', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-youtube group-hover:text-blue-500" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/></svg>`, placeholder: 'https://www.youtube.com/c/channel', value: '' }] });
            }
            if (type==='tiktok') {
                setDataProfile({ ...dataProfile, contact: [...dataProfile.contact, { type: 'tiktok', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-tiktok group-hover:text-blue-500" viewBox="0 0 16 16"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z"/></svg>`, placeholder: 'https://vm.tiktok.com/xxxxx', value: '' }] });
            }
        }
        setShowMoreContact(false);
    }
    const handleChangeValueContact = (e,i) => {
        const newDataContact = [...dataProfile.contact];
        newDataContact[i].value = e.target.value;
        setDataProfile({ ...dataProfile, contact: newDataContact });
    }
    useEffect(()=>{
        if (dataUser.skills) {
            setSkills(SkillsList.filter(skill=>!dataUser.skills.split(',').includes(skill)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <Layout title={'Account - Palettes'}>
            <Header/>
            <div className="mt-[159px] mb-[100px] max-w-screen-xl mx-auto">
                <div className="max-w-[576px] mb-[100px] px-[24px] md:px-[35px] mx-auto">
                    <h1 className="font-black text-5xl mb-8 text-center tracking-tighter">Account</h1>
                    <p className="text-center text-xl text-[#7d7c83]">Update your profile and set your account preferences.</p>
                </div>
                <div className="max-w-[1200px] flex flex-col lg:flex-row gap-10 mx-auto px-[24px] md:px-[35px] lg:px-[42px]">
                    <div className="bg-[#f7f7f8] lg:text-lg p-[30px] rounded-lg lg:w-[300px] font-medium">
                        <Link href={"/account/general"}>
                            <a className={`block mb-3 w-max transition ${pages==='general' ? 'text-blue-500' : 'hover:text-blue-500'}`}>General</a>
                        </Link>
                        <Link href={"/account/profile"}>
                            <a className={`block mb-3 w-max transition ${pages==='profile' ? 'text-blue-500' : 'hover:text-blue-500'}`}>Profile</a>
                        </Link>
                        <Link href={"/account/delete"}>
                            <a className={`block mb-3 w-max transition ${pages==='delete' ? 'text-blue-500' : 'hover:text-blue-500'}`}>Delete account</a>
                        </Link>
                    </div>
                    <div className="flex-1 flex flex-col gap-9">
                        {pages==='general' && (
                        <Fragment>
                            <div className="border p-[30px] rounded-xl">
                                <h1 className="font-extrabold text-2xl tracking-tighter mb-3">Username</h1>
                                <p className="text-scondary">If you change your username all the existing links to your profile on other websites will become 404.</p>
                                <div className="mt-[30px] flex justify-between items-center mb-3.5">
                                    <label htmlFor="_username" className="inline-block text-sm font-medium">Username</label>
                                    {usernameInvalid && (
                                    <p className="text-red-400 text-sm">{invalidUsernameMessage}</p>
                                    )}
                                </div>
                                <input name="username" placeholder="John" onChange={handleChangeDataGeneral} value={dataGeneral.username} type="text" id="_username" className={`border text-[15px] font-medium rounded-lg outline-none w-full h-[46px] px-4 ${!usernameInvalid ? 'hover:border-gray-400 border-gray-300 focus:border-blue-500' : 'border-red-400'}`}/>
                                <div className="text-right mt-8">
                                    <button onClick={handleSaveUsername} className="h-[46px] px-[21px] rounded-lg bg-blue-500 text-white font-bold transition hover:bg-blue-600">{loading !== 'username' ? (
                                        'Save'
                                    ) : (
                                        <Spinner/>
                                    )}</button>
                                </div>
                            </div>
                            <div className="border p-[30px] rounded-xl">
                                <h1 className="font-extrabold text-2xl tracking-tighter">Email</h1>
                                <div className="mt-[30px] flex justify-between items-center mb-3.5">
                                    <label htmlFor="_email" className="inline-block text-sm font-medium">Email address</label>
                                    {emailInvalid && (
                                    <p className="text-red-400 text-sm">{invalidEmailMessage}</p>
                                    )}
                                </div>
                                <input name="email" value={dataGeneral.email} placeholder="john@mail.com" onChange={handleChangeDataGeneral} type="email" id="_email" className={`border text-[15px] font-medium rounded-lg outline-none w-full h-[46px] px-4 ${emailInvalid ? 'border-red-400' : 'hover:border-gray-400 border-gray-300 focus:border-blue-500'}`}/>
                                <div className="text-right mt-8">
                                    <button onClick={handleSaveEmail} className="h-[46px] px-[21px] rounded-lg bg-blue-500 text-white font-bold transition hover:bg-blue-600">{loading !== 'email' ? (
                                        'Save'
                                    ) : (
                                        <Spinner/>
                                    )}</button>
                                </div>
                            </div>
                            <div className="border p-[30px] rounded-xl">
                                <h1 className="font-extrabold text-2xl tracking-tighter">Change Password</h1>
                                <div className="mt-[30px] flex justify-between items-center mb-3.5">
                                    <label htmlFor="_currentPW" className="inline-block text-sm font-medium">Current Password</label>
                                    {invalidCurrentPW && (
                                    <p className="text-red-400 text-sm">{invalidCurrentPW}</p>
                                    )}
                                </div>
                                <div className="relative">
                                    <input name="password" value={dataGeneral.password} onChange={handleChangeDataGeneral} type={!showCurrentPW ? 'password' : 'text'} id="_currentPW" className={`border text-[15px] rounded-lg outline-none w-full h-[46px] px-4 pr-[50px] ${!invalidCurrentPW ? 'hover:border-gray-400 border-gray-300 focus:border-blue-500' : 'border-red-400'}`}/>
                                    {!showCurrentPW ? (
                                    <div onClick={()=>setShowCurrentPW(state=>!state)} className="hover:bg-gray-100 absolute right-2 p-1 rounded top-1/2 -translate-y-1/2 cursor-pointer transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    ) : (
                                    <div onClick={()=>setShowCurrentPW(state=>!state)} className="hover:bg-gray-100 absolute right-2 p-1 rounded top-1/2 -translate-y-1/2 cursor-pointer transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    </div>
                                    )}
                                </div>
                                <div className="mt-[30px] flex justify-between items-center mb-3.5">
                                    <label htmlFor="_newPW" className="inline-block text-sm font-medium">New Password</label>
                                    {invalidNewPW && (
                                    <p className="text-red-400 text-sm">{invalidNewPW}</p>
                                    )}
                                </div>
                                <div className="relative">
                                    <input name="newPassword" value={dataGeneral.newPassword} onChange={handleChangeDataGeneral} type={!showNewPW ? 'password' : 'text'} placeholder="Min 8 characters" id="_newPW" className={`border text-[15px] rounded-lg outline-none w-full h-[46px] px-4 pr-[50px] ${!invalidNewPW ? 'hover:border-gray-400 border-gray-300 focus:border-blue-500' : 'border-red-400'}`}/>
                                    {!showNewPW ? (
                                    <div onClick={()=>setShowNewPW(state=>!state)} className="hover:bg-gray-100 absolute right-2 p-1 rounded top-1/2 -translate-y-1/2 cursor-pointer transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    ) : (
                                    <div onClick={()=>setShowNewPW(state=>!state)} className="hover:bg-gray-100 absolute right-2 p-1 rounded top-1/2 -translate-y-1/2 cursor-pointer transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    </div>
                                    )}
                                </div>
                                <div className="text-right mt-8">
                                    <button onClick={handleSavePassword} className="h-[46px] px-[21px] rounded-lg bg-blue-500 text-white font-bold transition hover:bg-blue-600">{loading !== 'password' ? (
                                        'Save'
                                    ) : (
                                        <Spinner/>
                                    )}</button>
                                </div>
                            </div>
                        </Fragment>
                        )}
                        {pages==='profile' && (
                        <Fragment>
                            <div className="border p-[30px] rounded-xl">
                                <h1 className="font-extrabold text-2xl tracking-tighter mb-3">About you</h1>
                                <div className="flex flex-col md:flex-row items-center gap-8 mt-[30px]">
                                    <div className="flex-1 w-full order-2 md:order-1">
                                        <div className="flex justify-between items-center mb-3">
                                            <label htmlFor="_name" className="inline-block text-sm font-medium">Name</label>
                                            {nullFullname && (
                                            <p className="text-sm text-red-400">This field is required</p>
                                            )}
                                        </div>
                                        <input value={dataProfile.fullname} name="fullname" onChange={handleChangeDataProfile} type="text" id="_name" className="border rounded-lg text-[15px] outline-none w-full font-medium h-[46px] px-4 hover:border-gray-400 border-gray-300 focus:border-blue-500"/>
                                        <label htmlFor="_headline" className="inline-block mt-4 text-sm font-medium mb-3">Headline</label>
                                        <input value={dataProfile.headline} onChange={handleChangeDataProfile} name="headline" type="text" placeholder="Welcome to my Palettes profile" id="_headline" className="border font-medium text-[15px] rounded-lg outline-none w-full h-[46px] px-4 hover:border-gray-400 border-gray-300 focus:border-blue-500"/>
                                    </div>
                                    <div className="order-1 md:order-2">
                                        <AvatarProfileEdit/>
                                    </div>
                                </div>
                                <label htmlFor="_location" className="inline-block mt-4 text-sm font-medium mb-3">Location</label>
                                <input value={dataProfile.location} onChange={handleChangeDataProfile} name="location" type="text" placeholder="New York, US" id="_location" className="border font-medium text-[15px] rounded-lg outline-none w-full h-[46px] px-4 hover:border-gray-400 border-gray-300 focus:border-blue-500"/>
                                <p className="inline-block mt-4 text-sm font-medium mb-3">Skills</p>
                                <div className={`relative border text-[15px] rounded-lg ${showMoreSkills ? 'border-x-blue-500 border-t-blue-500 border-b-0 rounded-bl-none rounded-br-none' : 'hover:border-gray-400 border-gray-300'}`}>
                                    <div className="p-2 flex flex-wrap gap-2">
                                        {dataProfile.skills.map((skill,i)=>(
                                        <div key={i} onClick={()=>removeSkill(skill)} className="bg-[#e6f0ff] h-[30px] flex-1 gap-[40px] px-2 rounded text-[#0066ff] whitespace-nowrap flex items-center justify-between cursor-pointer hover:bg-[#d6e7ff]">
                                            <span className="font-medium">{skill}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        ))}
                                        <input type="text" placeholder="Add new" onFocus={()=>setShowMoreSkills(true)} onBlur={handleUnfocus} className="cursor-pointer placeholder:text-scondary focus:placeholder:text-gray-400 px-2 outline-none flex-1 rounded-lg h-[30px]"/>
                                    </div>
                                    {showMoreSkills && (
                                    <div className="absolute bg-white outline outline-[1px] p-1.5 w-full outline-blue-500 top-full rounded-bl-lg rounded-br-lg max-h-[143px] overflow-auto hide-scrollbar">
                                        {dataProfile.skills.length<10 ? (
                                        skills.map((skill,i)=>(
                                            <div key={i} onClick={()=>addSkill(skill)} className="hover:bg-gray-100 px-3 py-1 rounded cursor-pointer">{skill}</div>
                                        ))
                                        ) : (
                                        <p className="px-3 py-1 text-scondary">Max 10 elements.</p>
                                        )}
                                    </div>
                                    )}
                                </div>
                                <label htmlFor="_bio" className="inline-block mt-4 text-sm font-medium mb-3">Biography</label>
                                <textarea value={dataProfile.bio} name="bio" onChange={handleChangeDataProfile} type="text" placeholder="New York, US" id="_bio" className="border text-[15px] rounded-lg outline-none w-full h-[200px] resize-none p-4 hover:border-gray-400 border-gray-300 focus:border-blue-500"/>
                            </div>
                            <div className="border p-[30px] rounded-xl">
                                <h1 className="font-extrabold text-2xl tracking-tighter mb-3">Contacts</h1>
                                <p className="text-scondary">List your website, portfolio, socials and contacts.</p>
                                {dataProfile.contact.length>0 && (
                                <div className="mt-8 flex flex-col gap-4">
                                    {dataProfile.contact.map((data,i)=>(
                                    <div key={i} className="relative">
                                        <input value={data.value} onChange={(e)=>handleChangeValueContact(e,i)} name={data.type} placeholder={data.placeholder} type="text" className="border font-medium text-[15px] rounded-lg outline-none w-full h-[46px] pl-[40px] pr-[50px]  hover:border-gray-400 border-gray-300 focus:border-blue-500"/>
                                        <div className="absolute px-3 flex items-center justify-between top-0 h-full w-full pointer-events-none left-0">
                                            <section dangerouslySetInnerHTML={{ __html: data.icon }}/>
                                            <div onClick={()=>handleRemoveContact(data.type)} className="p-1.5 pointer-events-auto cursor-pointer rounded-lg hover:bg-gray-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                                )}
                                <div className="text-right mt-10">
                                    <div className="relative">
                                        <button onClick={()=>setShowMoreContact(true)} className="border h-[36px] rounded-lg font-medium text-[15px] px-3 border-gray-300 hover:border-gray-400 transition">Add contact</button>
                                        {showMoreContact && (
                                        <Fragment>
                                            <div onClick={()=>setShowMoreContact(false)} className="fixed top-0 left-0 w-screen h-screen"></div>
                                            <div className="absolute right-0 z-10 translate-x-3">
                                                <div className="relative">
                                                    <div className="h-0 w-0 relative left-full -translate-x-8 border-x-[10px] border-x-transparent border-b-[10px] border-b-gray-300"></div>
                                                    <div className="h-0 w-0 absolute top-[1px] left-full -translate-x-8 mx-auto border-x-[10px] border-x-transparent border-b-[10px] border-b-white"></div>
                                                </div>
                                                <div className="bg-white shadow-md border rounded-xl p-2 divide-y">
                                                    <section className="grid grid-cols-4 p-6">
                                                        <div onClick={()=>handleAddContact('website')} className="h-[40px] w-[40px] flex items-center justify-center cursor-pointer rounded-lg group hover:bg-blue-100">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-globe group-hover:text-blue-500" viewBox="0 0 16 16">
                                                                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>
                                                            </svg>
                                                        </div>
                                                        <div onClick={()=>handleAddContact('email')} className="h-[40px] w-[40px] flex items-center justify-center cursor-pointer rounded-lg group hover:bg-blue-100">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-at group-hover:text-blue-500" viewBox="0 0 16 16">
                                                                <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"/>
                                                            </svg>
                                                        </div>
                                                        <div onClick={()=>handleAddContact('twitter')} className="h-[40px] w-[40px] flex items-center justify-center cursor-pointer rounded-lg group hover:bg-blue-100">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-twitter group-hover:text-blue-500" viewBox="0 0 16 16">
                                                                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                                                            </svg>
                                                        </div>
                                                        <div onClick={()=>handleAddContact('facebook')} className="h-[40px] w-[40px] flex items-center justify-center cursor-pointer rounded-lg group hover:bg-blue-100">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-facebook group-hover:text-blue-500" viewBox="0 0 16 16">
                                                                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                                                            </svg>
                                                        </div>
                                                        <div onClick={()=>handleAddContact('whatsapp')} className="h-[40px] w-[40px] flex items-center justify-center cursor-pointer rounded-lg group hover:bg-blue-100">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-whatsapp group-hover:text-blue-500" viewBox="0 0 16 16">
                                                                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                                                            </svg>
                                                        </div>
                                                        <div onClick={()=>handleAddContact('instagram')} className="h-[40px] w-[40px] flex items-center justify-center cursor-pointer rounded-lg group hover:bg-blue-100">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-instagram group-hover:text-blue-500" viewBox="0 0 16 16">
                                                                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                                                            </svg>
                                                        </div>
                                                        <div onClick={()=>handleAddContact('youtube')} className="h-[40px] w-[40px] flex items-center justify-center cursor-pointer rounded-lg group hover:bg-blue-100">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-youtube group-hover:text-blue-500" viewBox="0 0 16 16">
                                                                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                                                            </svg>
                                                        </div>
                                                        <div onClick={()=>handleAddContact('tiktok')} className="h-[40px] w-[40px] flex items-center justify-center cursor-pointer rounded-lg group hover:bg-blue-100">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-tiktok group-hover:text-blue-500" viewBox="0 0 16 16">
                                                                <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z"/>
                                                            </svg>
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>
                                        </Fragment>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="border p-[20px] rounded-xl">
                                <div className="text-right">
                                    <button onClick={handleSaveDataProfile} className="h-[46px] px-[21px] rounded-lg bg-blue-500 text-white font-bold transition hover:bg-blue-600">{loading!=='profile' ? (
                                        'Save'
                                    ) : (
                                        <Spinner/>
                                    )}</button>
                                </div>
                            </div>
                        </Fragment>
                        )}
                        {pages==='delete' && (
                        <div className="border p-[30px] rounded-xl">
                            <h1 className="font-extrabold text-2xl tracking-tighter mb-3">Delete account</h1>
                            <p className="text-scondary">Delete you account and all the data associated permanently.</p>
                            <label htmlFor="_accountPW" className="inline-block mt-[30px] text-sm font-medium mb-3.5">Account Password</label>
                            <div className="relative">
                                <input type={!showAccountPW ? 'password' : 'text'} id="_accountPW" className="border text-[15px] rounded-lg outline-none w-full h-[46px] px-4 pr-[50px] hover:border-gray-400 border-gray-300 focus:border-blue-500"/>
                                {!showAccountPW ? (
                                <div onClick={()=>setShowAccountPW(state=>!state)} className="hover:bg-gray-100 absolute right-2 p-1 rounded top-1/2 -translate-y-1/2 cursor-pointer transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                ) : (
                                <div onClick={()=>setShowAccountPW(state=>!state)} className="hover:bg-gray-100 absolute right-2 p-1 rounded top-1/2 -translate-y-1/2 cursor-pointer transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                </div>
                                )}
                            </div>
                            <div className="text-right mt-8">
                                <button className="h-[46px] px-[21px] rounded-lg bg-blue-500 text-white font-bold transition hover:bg-blue-600">Send delete link</button>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer/>
        </Layout>
    )
}

export async function getServerSideProps(ctx){
    const dataUser = await Authorization(ctx);
    if (dataUser) {
        return { props: { dataUser } }
    }
    return { notFound: true }
}