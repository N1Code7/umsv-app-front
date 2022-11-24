import Input from "../components/Input"

const Signin = () => {
  return (
  <main className="signin">
    <h1>Création de compte</h1>
    <form className="form">
      <div className="form-raw">
        <label htmlFor="lastName">NOM</label>
        <Input type="text" id="lastName" />
      </div>
      <div className="form-raw">
        <label htmlFor="firstName">Prénom</label>
        <Input type="text" id="firstName" />
      </div>
      <div className="form-raw">
        <label htmlFor="email">Email</label>
        <Input type="email" id="email" />
      </div>
      <div className="form-raw">
        <label htmlFor="password">Mot de passe</label>
        <Input type="password" id="password" />
      </div>
      <div className="form-raw">
        <label htmlFor="passwordConfirm">Confirmation mot de passe</label>
        <Input type="password" id="passwordConfirm" />
      </div>
      <Input type="submit" value="S'enregistrer" css="btn btn-primary" />
    </form>
  </main>
  )
}

export default Signin