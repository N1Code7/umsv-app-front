import { NavLink } from "react-router-dom";

interface INavigationProps {
  displayNavigation: boolean;
  isAdminConnected: boolean;
  toggleIsAdminConnected: () => void;
}

const Navigation = ({
  displayNavigation = false,
  isAdminConnected = false,
  toggleIsAdminConnected,
}: INavigationProps) => {
  // const { display, isAdminConnected } = useContext(NavigationContext);

  return isAdminConnected ? (
    <nav className={displayNavigation ? "nav nav-mobile" : "nav"}></nav>
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
