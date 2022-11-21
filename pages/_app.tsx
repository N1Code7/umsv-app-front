import '../sass/globals.scss'
import { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Component {...pageProps} />
  
    // <div suppressHydrationWarning>
    //   {typeof window === undefined ? null : <Component {...pageProps} />}
    // </div>
  );
}        
export default App; 