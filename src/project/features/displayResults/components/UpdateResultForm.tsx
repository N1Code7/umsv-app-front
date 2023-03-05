import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import { IResult, ITournamentRegistration } from "../../../../interfaces/interfaces";
import { mutate } from "swr";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

interface IProps {
  focusedRegistration: ITournamentRegistration;
  setRequestMessage: Dispatch<SetStateAction<{ success: string; error: string }>>;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
}

interface IFormErrors {}

const UpdateResultForm = ({ focusedRegistration, setRequestMessage, setIsModalActive }: IProps) => {
  const axiosPrivate = useAxiosPrivate();
  const [formErrors, setFormErrors] = useState({} as IFormErrors);
  const singleRef = useRef<HTMLSelectElement>(null);
  const doubleRef = useRef<HTMLSelectElement>(null);
  const mixedRef = useRef<HTMLSelectElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const resultRanks = [
    "Vainqueur",
    "Finaliste",
    "Demi-finaliste",
    "Quart de finaliste",
    "Huitième de finaliste",
    "Seizième de finaliste",
    "Poule",
  ];

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsModalActive?.(false);
    console.dir(doubleRef.current?.value || "");

    await mutate(
      "tournament-registrations",
      await axiosPrivate
        .patch(`result/${focusedRegistration.result?.id}`, {
          singleStageReached: singleRef.current?.value || "",
          doubleStageReached: doubleRef.current?.value || "",
          mixedStageReached: mixedRef.current?.value || "",
          comment: commentRef.current?.value || "",
        })
        .then((res) => {
          setRequestMessage({
            error: "",
            success: "Vos résultats ont bien été saisis ! 👌",
          });
          return {
            ...focusedRegistration,
            result: { ...focusedRegistration.result, ...res.data },
          };
        })
        .catch((err) => {
          console.error(err);
          setRequestMessage({
            error:
              "Une erreur est survenue lors de la saisie de vos résultats 🤕. Merci de réitérer l'opération. Si le problème persiste, contacter l'administrateur.",
            success: "",
          });
        }),
      {
        optimisticData: (registrations: Array<ITournamentRegistration>) => {
          const prevRegistrations = registrations.filter(
            (registration: ITournamentRegistration) =>
              registration?.result?.id !== focusedRegistration.result?.id
          );
          return [
            ...prevRegistrations,
            {
              ...focusedRegistration,
              result: {
                ...focusedRegistration.result,
                singleStageReached: singleRef.current?.value || "",
                doubleStageReached: doubleRef.current?.value || "",
                mixedStageReached: mixedRef.current?.value || "",
                comment: commentRef.current?.value || "",
              },
            },
          ];
        },
        populateCache: (
          updated: ITournamentRegistration,
          registrations: Array<ITournamentRegistration>
        ) => {
          const prevRegistrations = registrations.filter(
            (registration: ITournamentRegistration) =>
              registration?.result?.id !== focusedRegistration.result?.id
          );
          return [...prevRegistrations, updated];
        },
        rollbackOnError: true,
        revalidate: false,
      }
    );

    setTimeout(() => {
      setRequestMessage({ success: "", error: "" });
    }, 10000);
  };

  return (
    <form className="form" onSubmit={handleFormSubmit}>
      <div className="form-row">
        <label htmlFor="tournament-name">Nom du tournoi</label>
        <p>{focusedRegistration.tournament?.name || focusedRegistration.tournamentName}</p>
      </div>
      <div className="form-row">
        <label htmlFor="singleSelect">Simple</label>
        <select
          name="singleSelect"
          id="singleSelect"
          defaultValue={focusedRegistration.result?.singleStageReached || ""}
          ref={singleRef}
        >
          <option value="">---</option>
          {resultRanks.map((rank: string, index: number) => (
            <option key={index} value={rank.toLowerCase()}>
              {rank}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <label htmlFor="doubleSelect">Double</label>
        <select
          name="doubleSelect"
          id="doubleSelect"
          defaultValue={focusedRegistration.result?.doubleStageReached || ""}
          ref={doubleRef}
        >
          <option value="">---</option>
          {resultRanks.map((rank: string, index: number) => (
            <option key={index} value={rank.toLowerCase()}>
              {rank}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <label htmlFor="mixedSelect">Mixte</label>
        <select
          name="mixedSelect"
          id="mixedSelect"
          defaultValue={focusedRegistration.result?.mixedStageReached || ""}
          ref={mixedRef}
        >
          <option value="">---</option>
          {resultRanks.map((rank: string, index: number) => (
            <option key={index} value={rank.toLowerCase()}>
              {rank}
            </option>
          ))}
        </select>
      </div>
      {/* <div className="form-row select-ranks-container">
        <div className="select-rank">
          <label htmlFor="singleSelect">Simple</label>
          <select name="singleSelect" id="singleSelect">
            <option value="null">---</option>
            {resultRanks.map((rank: string, index: number) => (
              <option key={index}>{rank}</option>
            ))}
          </select>
        </div>
        <div className="select-rank">
          <label htmlFor="doubleSelect">Double</label>
          <select name="doubleSelect" id="doubleSelect">
            <option value="null">---</option>
            {resultRanks.map((rank: string, index: number) => (
              <option key={index}>{rank}</option>
            ))}
          </select>
        </div>
        <div className="select-rank">
          <label htmlFor="mixedSelect">Mixte</label>
          <select name="mixedSelect" id="mixedSelect">
            <option value="null">---</option>
            {resultRanks.map((rank: string, index: number) => (
              <option key={index}>{rank}</option>
            ))}
          </select>
        </div>
      </div> */}
      <div className="form-row">
        <label htmlFor="comment">Commentaire(s)</label>
        <textarea
          name="comment"
          id="comment"
          defaultValue={focusedRegistration.result?.comment || undefined}
          ref={commentRef}
        ></textarea>
      </div>

      <input type="submit" value="Mettre à jour mon résultat" className="btn btn-primary" />
    </form>
  );
};

export default UpdateResultForm;
