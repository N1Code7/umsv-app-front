import MemberHeader from "../components/MemberHeader";
import Navigation from "../components/Navigation";

const Homepage = () => {
  return (
    <>
      <MemberHeader />
      <Navigation />
      <main className="homepage">{/* <h1>HELLO WORLD</h1> */}</main>
    </>
  );
};

export default Homepage;
