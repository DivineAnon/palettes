import '../styles/globals.css';
import NProgress from 'nprogress';
import Router from 'next/router';
import { wrapper } from '../store';
import { setUser } from '../slices/userSlice';
import { GetToken } from '../lib';
import axios from 'axios';

function MyApp({ Component, pageProps }) {
  NProgress.configure({ showSpinner: false });
  Router.events.on('routeChangeStart',()=>{
    NProgress.start();
  });
  Router.events.on('routeChangeComplete',()=>{
    NProgress.done();
  });
  return <Component {...pageProps} />
}

MyApp.getInitialProps = wrapper.getInitialAppProps((store) => async ({ ctx }) => {
  const token = GetToken(ctx)
  if (token) {
    const user = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/users-permissions/user/getMe`,{
      headers: {
          Authorization: `bearer ${token}`
      }
    });
    store.dispatch(setUser(user.data));
  }
})

export default wrapper.withRedux(MyApp)
