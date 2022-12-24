import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { NavigationContext } from "../../contexts/NavigationContext";

const Navigation = () => {
  const { display } = useContext(NavigationContext);

  return (
    <nav className={display === true ? "nav-mobile active" : "nav-mobile"}>
      <ul>
        <li>
          <NavLink
            to="/tableau_de_bord/accueil"
            className={(nav) => (nav.isActive ? "link-active" : "")}
          >
            <span>🛎️</span>
            <span>Accueil</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/tableau_de_bord/tournois"
            className={(nav) => (nav.isActive ? "link-active" : "")}
          >
            <span>🏟️</span>
            <span>Mes Tournois</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/tableau_de_bord/inscription"
            className={(nav) => (nav.isActive ? "link-active" : "")}
          >
            <span>📝</span>
            <span>Inscription</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/tableau_de_bord/resultats"
            className={(nav) => (nav.isActive ? "link-active" : "")}
          >
            <span>🏅</span>
            <span>Mes Résultats</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/tableau_de_bord/reglages"
            className={(nav) => (nav.isActive ? "link-active" : "")}
          >
            <span>🧑</span>
            <span>Mon Profil</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
