import About from "../routes/About"
import Test from "../routes/Test"
import {NavLink} from "react-router-dom"

const Navigation = () => {
  return (
  <>
    <ul>
      <li>
        <NavLink to="/test">TEST</NavLink>
      </li>
      <li>
        <NavLink to="/about">ABOUT</NavLink>
      </li>
    </ul>
  </>
  )
}

export default Navigation