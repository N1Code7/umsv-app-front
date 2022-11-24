import Input from "../components/Input"

const Login = () => {
  return (
  <main className="login">
    <h1>Welcome to USMV App</h1>
    <form className="form">
      <div className="form-raw">
        <label htmlFor="email">Email</label>
        <Input type="email" id="email" />
        {/* <input type="email" id="email"/> */}
      </div>
      <div className="form-raw">
        <label htmlFor="password">Mot de passe</label>
        <Input type="password" id="password"  />
      </div>
      <Input type="submit" value="Se connecter" />
      <div className="remember-me">
        <Input  type="checkbox" id="rememberMe" />
        <label htmlFor="rememberMe">Se souvenir de moi</label>
      </div>
      <a href="#">Pas encore de compte ? En créer un 😉</a>
    </form>
  </main>
  )
}

export default Login