import { NavLink } from "react-router-dom"
import Input from "../components/Input"

const Login = () => {
  return (
  <main className="login">
    <h1>Welcome to USMV App</h1>
    <form className="form">
      <div className="form-raw">
        <label htmlFor="email">Email</label>
        <Input type="email" id="email" />
      </div>
      <div className="form-raw">
        <label htmlFor="password">Mot de passe</label>
        <Input type="password" id="password" />
      </div>
      <Input type="submit" value="Se connecter" css="btn btn-primary"/>
      <div className="remember-me">
        <Input  type="checkbox" id="rememberMe" />
        <label htmlFor="rememberMe">Se souvenir de moi</label>
      </div>
      <NavLink to="/nouveau-compte">
        Pas encore de compte ? Je veux en créer un 👉
      </NavLink>
    </form>
  </main>
  )
}

export default Login