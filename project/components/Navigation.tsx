import About from "../routes/About"
import Test from "../routes/Test"
import { NavLink } from "react-router-dom"
import { useState } from "react"



const Navigation = () => {
  const [active, setActive] = useState("")


  return (
  <nav className="nav-mobile">
    <ul>
      <li>
        <NavLink to="/home" className={(nav) => (nav.isActive ? "link-active" : "")}>
          <span>🛎️</span><span>Accueil</span>
        </NavLink>
      </li>
      <li>
        <NavLink to="/tournois" className={(nav) => (nav.isActive ? "link-active" : "")}>
          <span>🏟️</span><span>Mes Tournois</span>
        </NavLink>
      </li>
      <li >
        <NavLink to="/inscription" className={nav => (nav.isActive ? "link-active" : "")}>
          <span>📝</span><span>Inscription</span>
        </NavLink>
      </li>
      <li>
        <NavLink to="/resultats" className={nav => (nav.isActive ? "link-active" : "")}>
          <span>🏅</span><span>Mes Résultats</span>
        </NavLink>
      </li>
      <li>
        <NavLink to="/reglages" className={nav => (nav.isActive ? "link-active" : "")}>
          <span>🧑</span><span>Mon Profil</span>
        </NavLink>
      </li>
      {/* <li>
        <NavLink to="/test">TEST</NavLink>
      </li>
      <li>
        <NavLink to="/test">TEST</NavLink>
      </li>
      <li>
        <NavLink to="/test">TEST</NavLink>
      </li>
      <li>
        <NavLink to="/about">ABOUT</NavLink>
      </li> */}
    </ul>
  </nav>
  )
}

export default Navigation