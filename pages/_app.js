import '../styles/globals.css';
import NProgress from 'nprogress';
import Router from 'next/router';
import { Provider } from 'react-redux';
import { store } from '../store';
import { fetchUser } from '../slices/userSlice';

store.dispatch(fetchUser())

function MyApp({ Component, pageProps }) {
  NProgress.configure({ showSpinner: false });
  Router.events.on('routeChangeStart',()=>{
    NProgress.start();
  });
  Router.events.on('routeChangeComplete',()=>{
    NProgress.done();
  });
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
