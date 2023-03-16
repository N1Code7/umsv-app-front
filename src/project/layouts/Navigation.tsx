import { NavLink } from "react-router-dom";

interface INavigationProps {
  displayNavigation: boolean;
  isAdminViewActive: boolean;
}

const Navigation = ({ displayNavigation = false, isAdminViewActive }: INavigationProps) => {
  return isAdminViewActive ? (
    <nav className={displayNavigation ? "nav nav-mobile" : "nav"}>
      <ul>
        <li>
          <NavLink to="/admin">
            <span>🛎️</span>
            <span>Accueil</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/demandes_inscriptions">
            <span>📥</span>
            <span>Demandes d&apos;inscription</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/gestion_tournois">
            <span>🏟️</span>
            <span>Gestion tournois</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/gestion_articles">
            <span>📰</span>
            <span>Gestion articles</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/gestion_evenements">
            <span>🗓️</span>
            <span>Gestions événements</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/gestion_utilisateurs">
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
          <NavLink to="/">
            <span>🛎️</span>
            <span>Accueil</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/tournois">
            <span>🏟️</span>
            <span>Mes Tournois</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/nouvelle_inscription">
            <span>📝</span>
            <span>Inscription</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/resultats">
            <span>🏅</span>
            <span>Mes Résultats</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/reglages">
            <span>🧑</span>
            <span>Mon Profil</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
