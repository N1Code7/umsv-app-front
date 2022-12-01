import MemberHeader from "../components/MemberHeader";
import Navigation from "../components/Navigation";

const Homepage = () => {
  return (
    <main>
      <MemberHeader />
      <Navigation />
      <div className="homepage">{/* <h1>HELLO WORLD</h1> */}</div>
    </main>
  );
};

export default Homepage;
