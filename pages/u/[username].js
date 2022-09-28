import { Avatar, Footer, Header, Layout, PaletteSaves } from '../../components';
import axios from 'axios';

export default function Profile({ profile }){
    return (
        <Layout title={`${profile.fullname} - Palettes`}>
            <Header/>
            <div className='mt-[60px] md:mt-[160px]'>
                <div className='max-w-[576px] mx-auto px-[42px] text-center'>
                    <Avatar className={"mx-auto"} user={profile}/>
                    <h1 className='font-black text-4xl mt-7'>{profile.fullname}</h1>
                    {profile.location && (
                    <a href={`https://www.google.it/maps/search/${profile.location}`} target="_blank" rel="noopener noreferrer" className='text-[15px] text-blue-500 hover:underline font-bold mt-5 block'>{profile.location}</a>
                    )}
                    {profile.bio && (
                    <p className='mt-4 text-scondary'>{profile.bio}</p>
                    )}
                    {profile.skills && (
                    <div className='mt-6 text-xs uppercase font-bold text-scondary'>{profile.skills}</div>
                    )}
                    {profile.contact && (
                    <div className='flex mt-10 items-center justify-center gap-4'>
                        {profile.contact.slice(0,4).map((contact,i)=>(
                        <a key={i} href={contact.value} target="_blank" rel="noopener noreferrer" className='w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-500 transition'>
                            <span dangerouslySetInnerHTML={{ __html: contact.icon }}/>
                        </a>
                        ))}
                    </div>
                    )}
                </div>
                <div className='max-w-screen-xl mt-[60px] md:mt-[120px] mb-[60px] md:mb-[100px] mx-auto px-6 md:px-12 xl:px-20'>
                    {profile?.saves_palette.length>0 ? (
                    <div className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-8 gap-y-7'>
                        {profile?.saves_palette.map((obj,i)=>(
                        <PaletteSaves key={i} index={i} data={obj}/>
                        ))}
                    </div>
                    ) : (
                    <div className='p-[100px] bg-[#f7f7f8] text-scondary rounded-xl'>
                        <p className='text-center text-xl font-medium'>No palettes yet.</p>
                    </div>
                    )}
                </div>
            </div>
            <Footer/>
        </Layout>
    )
}


export async function getServerSideProps(ctx){
    const { username } = ctx.query;
    try {
        const profile = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/users-permissions/user/profile/${username}`);
        return { props: { profile: profile.data } }
    } catch (error) {
        return { notFound: true }
    }
}