import { NavLink } from "react-router-dom";
import Header from "../../layouts/Header";

const PageNotFound = () => {
  const adminView = localStorage.getItem("isAdminViewActive") === "true" || false;
  console.log(adminView);

  return (
    <>
      <Header />
      <main>
        <h1>PAGE NON TROUVÉE</h1>
        <p>Désolé, la page que vous avez demandé n&apos;existe pas 😅</p>
        <p>
          Retourner à l&apos;<NavLink to={adminView ? "/admin" : "/"}>accueil</NavLink>
        </p>
      </main>
    </>
  );
};

export default PageNotFound;
