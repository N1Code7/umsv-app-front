import { NavLink } from "react-router-dom";
import Header from "../components/Header";

const PageNotFound = () => {
  return (
    <>
      <Header />
      <main>
        <h1>PAGE NON TROUVÉE</h1>
        <p>Désolé, la page que vous avez demandé n&apos;existe pas 😅</p>
        <p>
          Retourner à l&apos;<NavLink to="/">accueil</NavLink>
        </p>
      </main>
    </>
  );
};

export default PageNotFound;
