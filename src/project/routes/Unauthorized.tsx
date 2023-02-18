import { NavLink } from "react-router-dom";
import Header from "../components/Header";

const Unauthorized = () => {
  return (
    <>
      <Header />
      <main>
        <h1>Accès réfusé</h1>
        <p>Désolé, vous ne possédez pas les droits pour accéder à cette page 🔒</p>
        <p>
          Retourner à l&apos;<NavLink to="/">accueil</NavLink>
        </p>
      </main>
    </>
  );
};

export default Unauthorized;
