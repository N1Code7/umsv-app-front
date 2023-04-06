import { Dispatch, MouseEvent, SetStateAction, useContext, useState } from "react";
import { IUser } from "../../../interfaces/interfaces";
import { formatDate } from "../../../utils/dateFunctions";
import { mutate } from "swr";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";

interface IProps {
  user: IUser;
  setFocusedUser: Dispatch<SetStateAction<IUser>>;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  setRequestMessage: Dispatch<SetStateAction<{ success: string; error: string }>>;
  setPatchMethod: Dispatch<SetStateAction<boolean>>;
}

const UserBand = ({
  user,
  setFocusedUser,
  setIsModalActive,
  setRequestMessage,
  setPatchMethod,
}: IProps) => {
  //
  const { user: connectedUser } = useContext(AuthenticationContext);
  const axiosPrivate = useAxiosPrivate();
  const [toggleChevron, setToggleChevron] = useState("down");

  const handleClick = (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    e.preventDefault();
    if (
      !Array.from(document.querySelectorAll(".cta-container button")).includes(e.target as Element)
    )
      toggleChevron === "down" ? setToggleChevron("up") : setToggleChevron("down");
    e.stopPropagation();
  };

  const handleModify = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFocusedUser?.(user);
    setIsModalActive?.(true);
    setPatchMethod?.(true);
  };

  const handleActivate = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await mutate(
      "/admin/users",
      await axiosPrivate
        .patch(`/admin/user/${user.id}/activation`)
        .then((res) => {
          setRequestMessage({
            success: `Le compte de ${res.data.firstName.toUpperCase()} a bien été activé.`,
            error: "",
          });
          return res.data;
        })
        .catch((err) => {
          console.error(err);
          setRequestMessage({
            success: "",
            error: "Une erreur est survenue lors de l'activation du compte 🤕.",
          });
        }),
      {
        optimisticData: (all: Array<IUser>) => {
          const prev = all.filter((item: IUser) => item.id !== user.id);
          return [...prev, { ...user, state: "active" }];
        },
        populateCache: (result: IUser, all: Array<IUser>) => {
          const prev = all.filter((item: IUser) => item.id !== user.id);
          return [...prev, result];
        },
        revalidate: false,
        rollbackOnError: true,
      }
    );

    setTimeout(() => {
      setRequestMessage({ success: "", error: "" });
    }, 10000);
  };

  const handleInactivate = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await mutate(
      "/admin/users",
      await axiosPrivate
        .patch(`/admin/user/${user.id}/inactivation`)
        .then((res) => {
          setRequestMessage({
            success: `Le compte de ${res.data.firstName.toUpperCase()} a bien été désactivé.`,
            error: "",
          });
          return res.data;
        })
        .catch((err) => {
          console.error(err);
          setRequestMessage({
            success: "",
            error: "Une erreur est survenue lors de l'inactivation du compte 🤕.",
          });
        }),
      {
        optimisticData: (all: Array<IUser>) => {
          const prev = all.filter((item: IUser) => item.id !== user.id);
          return [...prev, { ...user, state: "inactive" }];
        },
        populateCache: (result: IUser, all: Array<IUser>) => {
          const prev = all.filter((item: IUser) => item.id !== user.id);
          return [...prev, result];
        },
        revalidate: false,
        rollbackOnError: true,
      }
    );

    setTimeout(() => {
      setRequestMessage({ success: "", error: "" });
    }, 10000);
  };

  const handlePromote = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await mutate(
      "/admin/users",
      await axiosPrivate
        .patch(`/admin/user/${user.id}/promotion`)
        .then((res) => {
          setRequestMessage({
            success: `Le compte de ${res.data.firstName.toUpperCase()} a bien été promu ADMIN.`,
            error: "",
          });
          return res.data;
        })
        .catch((err) => {
          console.error(err);
          setRequestMessage({
            success: "",
            error: "Une erreur est survenue lors de la promotion du compte en ADMIN 🤕.",
          });
        }),
      {
        optimisticData: (all: Array<IUser>) => {
          const prev = all.filter((item: IUser) => item.id !== user.id);
          return [...prev, { ...user, roles: ["ROLE_ADMIN", "ROLE_MEMBER"] }];
        },
        populateCache: (result: IUser, all: Array<IUser>) => {
          const prev = all.filter((item: IUser) => item.id !== user.id);
          return [...prev, result];
        },
        revalidate: false,
        rollbackOnError: true,
      }
    );

    setTimeout(() => {
      setRequestMessage({ success: "", error: "" });
    }, 10000);
  };

  const handleDemote = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await mutate(
      "/admin/users",
      await axiosPrivate
        .patch(`/admin/user/${user.id}/demotion`)
        .then((res) => {
          setRequestMessage({
            success: `Le compte de ${res.data.firstName.toUpperCase()} a bien été rétrogradé MEMBRE.`,
            error: "",
          });
          return res.data;
        })
        .catch((err) => {
          console.error(err);
          setRequestMessage({
            success: "",
            error: "Une erreur est survenue lors de la rétrogation du compte en MEMBRE 🤕.",
          });
        }),
      {
        optimisticData: (all: Array<IUser>) => {
          const prev = all.filter((item: IUser) => item.id !== user.id);
          return [...prev, { ...user, roles: ["ROLE_MEMBER"] }];
        },
        populateCache: (result: IUser, all: Array<IUser>) => {
          const prev = all.filter((item: IUser) => item.id !== user.id);
          return [...prev, result];
        },
        revalidate: false,
        rollbackOnError: true,
      }
    );

    setTimeout(() => {
      setRequestMessage({ success: "", error: "" });
    }, 10000);
  };

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await mutate(
      "/admin/users",
      await axiosPrivate
        .delete(`/admin/user/${user.id}`)
        .then((res) => {
          setRequestMessage({
            success: `Le compte a bien été supprimé !`,
            error: "",
          });
          return res.data;
        })
        .catch((err) => {
          console.error(err);
          setRequestMessage({
            success: "",
            error: "Une erreur est survenue lors de la suppression du compte 🤕.",
          });
        }),
      {
        optimisticData: (all: Array<IUser>) => all.filter((item: IUser) => item.id !== user.id),
        populateCache: (result: IUser, all: Array<IUser>) =>
          all.filter((item: IUser) => item.id !== user.id),
        revalidate: false,
        rollbackOnError: true,
      }
    );

    setTimeout(() => {
      setRequestMessage({ success: "", error: "" });
    }, 10000);
  };

  return (
    <div
      className="band user"
      id="userBand"
      style={toggleChevron === "down" && window.innerWidth > 1000 ? { rowGap: 0 } : undefined}
      onClick={handleClick}
    >
      <div className="user-identity">{user.firstName + " " + user.lastName}</div>

      <div
        className="details"
        style={
          toggleChevron === "down"
            ? { maxHeight: 0, opacity: 0, margin: 0, zIndex: "-1" }
            : { maxHeight: 500, opacity: 1, marginTop: "0.5rem", marginBottom: "0.5rem", zIndex: 0 }
        }
      >
        <i className="fa-solid fa-envelope"></i>
        <div className="user-email">{user.email}</div>
        {user.gender && (
          <>
            <i className="fa-solid fa-venus-mars"></i>
            <div className="user-gender">{user.gender === "male" ? "Masculin" : "Féminin"}</div>
          </>
        )}
        {user.birthDate && (
          <>
            <i className="fa-solid fa-cake-candles"></i>
            <div className="user-birthDate">
              {formatDate(String(user.birthDate), undefined, "long")}
            </div>
          </>
        )}
        <i className="fa-solid fa-clipboard-check"></i>
        <div className="user-state">
          {user.state === "pending"
            ? "En attente"
            : user.state === "active"
            ? "Activé"
            : "Désactivé"}
        </div>
        <i className="fa-solid fa-user-check"></i>
        <div className="user-validated-account">
          {user.validatedAccount ? "Compte validé" : "Compte invalide"}
        </div>
      </div>

      {(connectedUser?.roles.includes("ROLE_SUPERADMIN") ||
        user.roles.toString() === ["ROLE_MEMBER"].toString() ||
        connectedUser?.id === user?.id) && (
        <div className="cta-container">
          <button className="btn btn-modify" onClick={handleModify}>
            ✏️
          </button>
          <button
            className="btn btn-success"
            style={{ display: user.state === "active" ? "none" : "flex" }}
            onClick={handleActivate}
          >
            ✅
          </button>
          <button
            className="btn btn-cancel"
            style={{ display: user.state === "inactive" ? "none" : "flex" }}
            onClick={handleInactivate}
          >
            🚫
          </button>
          <button
            className="btn btn-modify"
            style={{ display: user.roles.includes("ROLE_ADMIN") ? "none" : "flex" }}
            onClick={handlePromote}
          >
            ⬆️
          </button>
          <button
            className="btn btn-modify"
            style={{
              display: user.roles.toString() === ["ROLE_MEMBER"].toString() ? "none" : "flex",
            }}
            onClick={handleDemote}
          >
            ⬇️
          </button>
          <button className="btn btn-delete" onClick={handleDelete}>
            🗑️
          </button>
        </div>
      )}

      <button onClick={handleClick}>
        <i className={`fa-solid fa-chevron-${toggleChevron}`}></i>
      </button>
    </div>
  );
};

export default UserBand;
