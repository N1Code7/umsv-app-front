import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { NavigationContext } from "../../contexts/NavigationContext";

const Navigation = () => {
  const { display } = useContext(NavigationContext);

  return (
    <nav className={display === true ? "nav-mobile active" : "nav-mobile"}>
      <ul>
        <li>
          <NavLink to="/accueil" className={(nav) => (nav.isActive ? "link-active" : "")}>
            <span>🛎️</span>
            <span>Accueil</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/tournois" className={(nav) => (nav.isActive ? "link-active" : "")}>
            <span>🏟️</span>
            <span>Mes Tournois</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/inscription" className={(nav) => (nav.isActive ? "link-active" : "")}>
            <span>📝</span>
            <span>Inscription</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/resultats" className={(nav) => (nav.isActive ? "link-active" : "")}>
            <span>🏅</span>
            <span>Mes Résultats</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/reglages" className={(nav) => (nav.isActive ? "link-active" : "")}>
            <span>🧑</span>
            <span>Mon Profil</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
