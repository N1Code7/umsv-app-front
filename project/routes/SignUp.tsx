import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Input from "../components/Input";
import Header from "../components/Header";

const SignUp = () => {
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const [percent, setPercent] = useState("");

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleLastName = (e: any) => {
    setLastName(e.target.value);
  };
  const handleFirstName = (e: any) => {
    setFirstName(e.target.value);
  };
  const handleEmail = (e: any) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e: any) => {
    setPassword(e.target.value);
  };
  const handlePasswordConfirm = (e: any) => {
    setPasswordConfirm(e.target.value);
  };

  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordConfirmVisibility = (e: any) => {
    e.preventDefault();
    setPasswordConfirmVisible(!passwordConfirmVisible);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    !lastName.match(/^[A-Za-z][A-Za-z -]+/)
      ? setLastNameError(
          "Votre nom de famille doit commencer par une lettre et ne doit pas comporter de chiffre"
        )
      : setLastNameError("");
    !firstName.match(/^[A-Za-z][A-Za-z -]+/)
      ? setFirstNameError(
          "Votre prénom doit commencer par une lettre et ne doit pas comporter de chiffre"
        )
      : setFirstNameError("");
    !email.match(/^[a-z0-9-\-]+@[a-z0-9-]+\.[a-z0-9]{2,5}$/)
      ? setEmailError("L'email renseigné n'est pas conforme")
      : setEmailError("");
    !password.match(/^[\w\-\*\/!?#&\$\^€%]{6,}/)
      ? setPasswordError("Votre mot de passe comporte des caractères interdits")
      : setPasswordError("");
    password !== passwordConfirm
      ? setPasswordConfirmError("Les deux mots de passe ne correspondent pas !")
      : setPasswordConfirmError("");

    // if (
    //   lastName.match(/^[A-Za-z][A-Za-z -]+/) &&
    //   firstName.match(/^[A-Za-z][A-Za-z -]+/) &&
    //   email.match(/^[a-z0-9-\-]+@[a-z0-9-]+\.[a-z0-9]{2,5}$/) &&
    //   password.match(/^[\w\-\*\/!?#&\$\^€%]{6,}/) &&
    //   password === passwordConfirm
    // ) {
    //   setIsLoading(true);
    //   try {
    //     const req = await fetch("http://127.0.0.1:8000/api/user/account", {
    //       method: "POST",
    //       body: JSON.stringify({
    //         lastName: lastName.toUpperCase(),
    //         firstName: `${firstName[0].toUpperCase()}${firstName.slice(1, firstName.length - 1)}`,
    //         email,
    //         password,
    //       }),
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     });

    //     if (!req.ok) {
    //       throw new Error(`Error! status : ${req.status} `);
    //     }

    //     const res = await req.json();

    //     console.log("result is: ", JSON.stringify(res, null, 4));

    //     setData(res);
    //   } catch (error: any) {
    //     setErr(error.message);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }
  };

  useEffect(() => {
    if (password.length === 0) {
      setPercent("");
    } else if (password.length >= 10 && password.match(/[A-Z]+[0-9]+/)) {
      setPercent("100");
    } else if (password.length >= 6) {
      setPercent("66");
    } else {
      setPercent("33");
    }
  }, [password]);

  return (
    <>
      <Header />
      <main className="sigUp">
        <h1>Création de compte</h1>
        <form className="form">
          <div className="form-row">
            <label htmlFor="lastName">NOM</label>
            <Input type="text" id="lastName" value={lastName} action={handleLastName} />
            {lastNameError !== "" && <div className="errorMessage-input">{lastNameError}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="firstName">Prénom</label>
            <Input type="text" id="firstName" value={firstName} action={handleFirstName} />
            {firstNameError !== "" && <div className="errorMessage-input">{firstNameError}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <Input type="email" id="email" value={email} action={handleEmail} />
            {emailError !== "" && <div className="errorMessage-input">{emailError}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="password">Mot de passe</label>
            <div className="password-input">
              <Input
                type={passwordVisible ? "text" : "password"}
                id="password"
                action={handlePassword}
              />
              <button
                className={passwordVisible ? "hide" : "display"}
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </button>
            </div>

            <div
              className={
                percent !== ""
                  ? `password-evaluation password-evaluation-${percent}`
                  : "password-evaluation"
              }
            ></div>
            {passwordError !== "" && <div className="errorMessage-input">{passwordError}</div>}
          </div>
          <div className="form-row">
            <label htmlFor="passwordConfirm">Confirmation mot de passe</label>
            <div className="password-input">
              <Input
                type={passwordConfirmVisible ? "text" : "password"}
                id="passwordConfirm"
                value={passwordConfirm}
                action={handlePasswordConfirm}
              />
              <button
                className={passwordConfirmVisible ? "hide" : "display"}
                onClick={togglePasswordConfirmVisibility}
              >
                {passwordConfirmVisible ? (
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </button>
            </div>
            {passwordConfirmError !== "" && (
              <div className="errorMessage-input">{passwordConfirmError}</div>
            )}
          </div>
          <Input type="submit" value="S'enregistrer" css="btn btn-primary" action={handleSubmit} />
          <NavLink to="/">J&apos;ai déjà un compte, je souhaite me connecter 👉</NavLink>
        </form>
      </main>
    </>
  );
};

export default SignUp;
