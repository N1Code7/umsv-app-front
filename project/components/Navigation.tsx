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
            to="/utilisateur/accueil"
            className={(nav) => (nav.isActive ? "link-active" : "")}
          >
            <span>🛎️</span>
            <span>Accueil</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/utilisateur/tournois"
            className={(nav) => (nav.isActive ? "link-active" : "")}
          >
            <span>🏟️</span>
            <span>Mes Tournois</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/utilisateur/inscription"
            className={(nav) => (nav.isActive ? "link-active" : "")}
          >
            <span>📝</span>
            <span>Inscription</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/utilisateur/resultats"
            className={(nav) => (nav.isActive ? "link-active" : "")}
          >
            <span>🏅</span>
            <span>Mes Résultats</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/utilisateur/reglages"
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
