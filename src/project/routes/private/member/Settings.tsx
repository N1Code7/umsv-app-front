import { FormEvent, MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { AuthenticationContext } from "../../../../contexts/AuthenticationContext";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { userInfoSchema } from "../../../../validations/userInfoSchema";
import { ValidationError } from "yup";

interface IFormErrors {
  email: string;
  previousPassword: string;
  password: string;
  confirmPassword: string;
}

const Settings = () => {
  const { user, setUser } = useContext(AuthenticationContext);
  const axiosPrivate = useAxiosPrivate();
  const emailRef = useRef<HTMLInputElement>(null);
  const previousPasswordRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [previousPasswordVisible, setPreviousPasswordVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const [percent, setPercent] = useState("");
  const [formErrors, setFormErrors] = useState({} as IFormErrors);
  const [requestMessage, setRequestMessage] = useState({ success: "", error: "" });

  const togglePreviousPasswordVisibility = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPreviousPasswordVisible((prev) => !prev);
  };

  const togglePasswordVisibility = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPasswordVisible((prev) => !prev);
  };

  const togglePasswordConfirmVisibility = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPasswordConfirmVisible((prev) => !prev);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    //
    let errors = {} as IFormErrors;
    let request = {
      email: user?.email !== emailRef.current?.value ? emailRef.current?.value : undefined,
      previousPassword: previousPasswordRef.current?.value || undefined,
      password: password || undefined,
      confirmPassword: passwordConfirmRef.current?.value || undefined,
    };
    console.log(request);

    //
    await userInfoSchema
      .validate(request, { abortEarly: false })
      .then(() =>
        axiosPrivate
          .patch("user", request)
          .then((res) => {
            res.data;
            user?.email !== emailRef.current?.value &&
              setUser?.((prev) => ({ ...prev, email: emailRef.current!.value }));
          })
          .catch((err) => {
            console.error(err);
            setRequestMessage({
              success: "",
              error:
                "Une erreur est survenue lors de la mise à jour de vos informations personnelles.",
            });
          })
      )
      .catch((err) =>
        err.inner.forEach(
          (err: ValidationError) => (errors = { ...errors, [err.path as string]: err.message })
        )
      );
    setFormErrors(errors);
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
      <main className="user-space" style={{ maxWidth: 1600 }}>
        {requestMessage.success !== "" && (
          <div className="notification-message">
            <p className="success">{requestMessage.success}</p>
          </div>
        )}
        {requestMessage.error !== "" && (
          <div className="notification-message">
            <p className="error">{requestMessage.error}</p>
          </div>
        )}

        <h2>Mes réglages</h2>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            {formErrors.email && <div className="form-error-detail">{formErrors.email}</div>}
            <input
              type="text"
              name="email"
              id="email"
              defaultValue={user?.email}
              ref={emailRef}
              autoFocus
            />
          </div>
          <div className="form-separator"></div>
          <div className="form-row">
            <label htmlFor="confirmPassword">Précédent de mot de passe</label>
            {formErrors.previousPassword && (
              <div className="form-error-detail">{formErrors.previousPassword}</div>
            )}
            <div className="password-input">
              <input
                type={passwordConfirmVisible ? "text" : "password"}
                id="previousPassword"
                ref={previousPasswordRef}
              />
              <button
                className={previousPasswordVisible ? "hide" : "display"}
                onClick={togglePreviousPasswordVisibility}
              >
                {previousPasswordVisible ? (
                  <i className="fa-solid fa-eye-slash"></i>
                ) : (
                  <i className="fa-solid fa-eye"></i>
                )}
              </button>
            </div>
          </div>
          <div className="form-row">
            <label htmlFor="password">Nouveau de mot de passe</label>
            {formErrors.password && <div className="form-error-detail">{formErrors.password}</div>}
            <div className="password-input">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>
          <div className="form-row">
            <label htmlFor="confirmPassword">Confirmer mon nouveau de mot de passe</label>
            {formErrors.confirmPassword && (
              <div className="form-error-detail">{formErrors.confirmPassword}</div>
            )}
            <div className="password-input">
              <input
                type={passwordConfirmVisible ? "text" : "password"}
                id="confirmPassword"
                ref={passwordConfirmRef}
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
          </div>
          <input type="submit" value="Mettre à jour mes informations" className="btn btn-primary" />
        </form>
      </main>
    </>
  );
};

export default Settings;
