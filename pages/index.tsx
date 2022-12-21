import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import { NavigationContext } from "../contexts/NavigationContext";
import Footer from "../project/components/Footer";
import Header from "../project/components/Header";
import { AuthenticationContext } from "../contexts/AuthenticationContext";

const LazyComponent = dynamic(() => import("../project/myApp"), { ssr: false });

const Home = () => {
  const [display, setDisplay] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [user, setUser] = useState({});

  const toggleDisplay = () => {
    setDisplay(!display);
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
        <meta name="description" content="Generated by create next app" />
        <title>USMV APP</title>
      </Head>
      <Header />
      <AuthenticationContext.Provider value={{ authToken, user, setAuthToken, setUser }}>
        <NavigationContext.Provider value={{ display, toggleDisplay }}>
          <LazyComponent />
        </NavigationContext.Provider>
      </AuthenticationContext.Provider>
      <Footer />
    </>
  );
};

export default Home;
