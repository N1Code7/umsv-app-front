import { Dispatch, MouseEvent, SetStateAction, useContext } from "react";
import { ITournamentRegistration } from "../../../interfaces/interfaces";
import { mutate } from "swr";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import RegistrationMobileDisplay from "./components/RegistrationMobileDisplay";
import RegistrationDesktopDisplay from "./components/RegistrationDesktopDisplay";

interface ITournamentRegistrationProps {
  tournamentRegistration: ITournamentRegistration;
  displayOnMobile: boolean;
  setFocusedRegistration: Dispatch<SetStateAction<ITournamentRegistration>>;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  setRequestMessage: Dispatch<SetStateAction<{ success: string; error: string }>>;
}

const TournamentRegistration = ({
  tournamentRegistration,
  displayOnMobile,
  setIsModalActive,
  setFocusedRegistration,
  setRequestMessage,
}: ITournamentRegistrationProps) => {
  const axiosPrivate = useAxiosPrivate();
  const { user } = useContext(AuthenticationContext);

  const handleModify = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFocusedRegistration(tournamentRegistration);
    setIsModalActive(true);
  };

  const handleCancel = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await mutate(
      "tournament-registrations",
      await axiosPrivate
        .patch(`tournament-registration/cancel/${tournamentRegistration.id}`)
        .then((res) => {
          setRequestMessage({
            error: "",
            success: "Votre demande d'inscription a bien été annulée ! 👌",
          });
          return res.data;
        })
        .catch((err) => {
          // console.error(err)
          setRequestMessage({
            error:
              "Une erreur est survenue lors de l'annulation de votre demande d'inscription 🤕. Merci de réitérer l'opération. Si le problème persiste, contacter l'administrateur.",
            success: "",
          });
        }),
      {
        optimisticData: (tournamentsRegistrations: Array<ITournamentRegistration>) => {
          const prev = tournamentsRegistrations.filter(
            (registration: ITournamentRegistration) => registration.id !== tournamentRegistration.id
          );
          return [...prev, { ...tournamentRegistration, requestState: "cancelled" }];
        },
        populateCache: (
          tournamentRegistration: ITournamentRegistration,
          tournamentsRegistrations: Array<ITournamentRegistration>
        ) => {
          const prev = tournamentsRegistrations.filter(
            (registration: ITournamentRegistration) => registration.id !== tournamentRegistration.id
          );
          return [...prev, tournamentRegistration];
        },
        rollbackOnError: true,
        revalidate: false,
      }
    );

    setTimeout(() => {
      setRequestMessage({ success: "", error: "" });
    }, 10000);
  };

  return displayOnMobile ? (
    <RegistrationMobileDisplay
      tournamentRegistration={tournamentRegistration}
      handleCancel={handleCancel}
      handleModify={handleModify}
    />
  ) : (
    <RegistrationDesktopDisplay
      tournamentRegistration={tournamentRegistration}
      handleCancel={handleCancel}
      handleModify={handleModify}
    />
  );
};

export default TournamentRegistration;
