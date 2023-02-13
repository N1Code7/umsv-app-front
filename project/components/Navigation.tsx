import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

interface INavigationProps {
  displayNavigation: boolean;
  isAdminConnected: boolean;
}

const Navigation = ({ displayNavigation = false, isAdminConnected = false }: INavigationProps) => {
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (isAdminConnected) {
  //     navigate("/admin/");
  //   } else {
  //     navigate("/");
  //   }
  // }, [isAdminConnected]);

  return isAdminConnected ? (
    <nav className={displayNavigation ? "nav nav-mobile" : "nav"}>
      <ul>
        <li>
          <NavLink to="/admin/" className={(nav) => (nav.isActive ? "link-active" : "")}>
            <span>🛎️</span>
            <span>Accueil</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/demandes_inscriptions"
            className={(nav) => (nav.isActive ? "link-active" : "")}
          >
            <span>📥</span>
            <span>Demandes d&apos;inscription</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/gestion_tournois"
            className={(nav) => (nav.isActive ? "link-active" : "")}
          >
            <span>🏟️</span>
            <span>Gestion tournois</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/gestion_articles"
            className={(nav) => (nav.isActive ? "link-active" : "")}
          >
            <span>📰</span>
            <span>Gestion articles</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/gestion_evenements"
            className={(nav) => (nav.isActive ? "link-active" : "")}
          >
            <span>🗓️</span>
            <span>Gestions événements</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/gestion_utilisateurs"
            className={(nav) => (nav.isActive ? "link-active" : "")}
          >
            <span>👤</span>
            <span>Gestions utilisateurs</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  ) : (
    <nav className={displayNavigation ? "nav nav-mobile" : "nav"}>
      <ul>
        <li>
          <NavLink to="/" className={(nav) => (nav.isActive ? "link-active" : "")}>
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
          <NavLink
            to="/nouvelle_inscription"
            className={(nav) => (nav.isActive ? "link-active" : "")}
          >
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
