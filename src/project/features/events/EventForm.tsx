import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import { mutate } from "swr";
import { ValidationError } from "yup";
import useAxiosPrivateMultipart from "../../../hooks/useAxiosPrivateMultipart";
import { IClubEvent } from "../../../interfaces/interfaces";
import { eventSchema } from "../../../validations/eventSchema";
import { formatDate } from "../../../utils/dateFunctions";

interface IProps {
  patchMethod?: boolean;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  focusedEvent: IClubEvent;
  setRequestMessage: Dispatch<SetStateAction<{ success: string; error: string }>>;
}

interface IFormErrors {
  startDate: string;
  endDate: string;
  content: string;
  visible: boolean;
}

const EventForm = ({ patchMethod, focusedEvent, setIsModalActive, setRequestMessage }: IProps) => {
  //
  const axiosPrivateMultipart = useAxiosPrivateMultipart();
  const [formErrors, setFormErrors] = useState({} as IFormErrors);
  const eventStartDateRef = useRef<HTMLInputElement>(null);
  const eventEndDateRef = useRef<HTMLInputElement>(null);
  const eventContentRef = useRef<HTMLInputElement>(null);
  const eventFileRef = useRef<HTMLInputElement>(null);
  const isEventVisibleRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let errors = {} as IFormErrors;

    const bodyRequest = {
      startDate: eventStartDateRef.current!.value,
      endDate: eventEndDateRef.current!.value,
      content: eventContentRef.current!.value,
      visible: isEventVisibleRef.current!.checked,
    };

    await eventSchema
      .validate(bodyRequest, { abortEarly: false })
      .then(async () => {
        setIsModalActive?.(false);

        let formData = new FormData();
        eventFileRef.current?.files?.[0] && formData.append("file", eventFileRef.current?.files[0]);
        formData.append("data", JSON.stringify(bodyRequest));

        if (!patchMethod) {
          await mutate(
            "/events",
            await axiosPrivateMultipart
              .post("/event", formData)
              .then((res) => {
                setRequestMessage({ success: "L'événement a bien été créé ! 👌", error: "" });
                return res.data;
              })
              .catch((err) => {
                console.error(err);
                setRequestMessage({
                  success: "",
                  error: "Une erreur est survenue lors de la création de l'événement ! 🤕",
                });
              }),
            {
              optimisticData: (events: Array<IClubEvent>) =>
                [...events, { id: events.slice(-1)[0].id + 1, ...bodyRequest } as IClubEvent].sort(
                  (a: IClubEvent, b: IClubEvent) =>
                    Number(new Date(b.updatedAt || b.createdAt)) -
                    Number(new Date(a.updatedAt || a.createdAt))
                ),
              populateCache: (newEvent: IClubEvent, events: Array<IClubEvent>) => [
                ...events,
                newEvent,
              ],
              revalidate: false,
              rollbackOnError: true,
            }
          );
        } else {
          await mutate(
            "/events",
            await axiosPrivateMultipart
              .post(`/event/${focusedEvent.id}`, formData)
              .then((res) => {
                setRequestMessage({ success: "L'événement a bien été modifié ! 👌", error: "" });
                return res.data;
              })
              .catch((err) => {
                console.error(err);
                setRequestMessage({
                  success: "",
                  error: "Une erreur est survenue lors de la modification de l'événement ! 🤕",
                });
              }),
            {
              optimisticData: (events: Array<IClubEvent>) => {
                const prev = events.filter((event: IClubEvent) => event.id !== focusedEvent.id);
                return [...prev, { id: focusedEvent.id, ...bodyRequest } as IClubEvent].sort(
                  (a: IClubEvent, b: IClubEvent) =>
                    Number(new Date(b.updatedAt || b.createdAt)) -
                    Number(new Date(a.updatedAt || a.createdAt))
                );
              },
              populateCache: (newEvent: IClubEvent, events: Array<IClubEvent>) => {
                const prev = events.filter((event: IClubEvent) => event.id !== focusedEvent.id);
                return [...prev, newEvent];
              },
              revalidate: false,
              rollbackOnError: true,
            }
          );
        }

        setTimeout(() => {
          setRequestMessage({ success: "", error: "" });
        }, 10000);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        console.dir(err);

        err.inner.forEach(
          (err: ValidationError) => (errors = { ...errors, [err.path as string]: err.message })
        );
      });

    setFormErrors(errors);
  };

  //
  return (
    <form className="form" onSubmit={handleFormSubmit}>
      <div className="form-row">
        <label htmlFor="eventContent">Contenu de l&apos;événement</label>
        {formErrors.content && <div className="form-error-detail">{formErrors.content}</div>}
        <input
          type="text"
          id="eventContent"
          className={formErrors.content ? "form-error" : undefined}
          autoFocus
          defaultValue={focusedEvent?.content || undefined}
          ref={eventContentRef}
        />
      </div>

      <div className="form-row">
        {formErrors.startDate && <div className="form-error-detail">{formErrors.startDate}</div>}
        {formErrors.endDate && <div className="form-error-detail">{formErrors.endDate}</div>}
        <div className="dates">
          <label htmlFor="startDate">Du </label>
          <input
            type="date"
            id="startDate"
            ref={eventStartDateRef}
            min={formatDate(new Date().toISOString(), undefined, "XXXX-XX-XX")}
            defaultValue={
              (focusedEvent?.startDate &&
                formatDate(focusedEvent?.startDate, undefined, "XXXX-XX-XX")) ||
              undefined
            }
            required
          />
          <label htmlFor="endDate"> au </label>
          <input
            type="date"
            id="endDate"
            ref={eventEndDateRef}
            min={
              eventStartDateRef.current?.value
                ? formatDate(
                    new Date(
                      new Date(eventStartDateRef.current?.value!).setDate(
                        new Date(eventStartDateRef.current?.value!).getDate() + 1
                      )
                    ).toISOString(),
                    undefined,
                    "XXXX-XX-XX"
                  )
                : undefined
            }
            defaultValue={
              (focusedEvent?.endDate &&
                formatDate(focusedEvent?.endDate, undefined, "XXXX-XX-XX")) ||
              undefined
            }
          />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="visibility">Publier l&apos;article ?</label>
        <input
          type="checkbox"
          id="visibility"
          ref={isEventVisibleRef}
          defaultChecked={focusedEvent?.visible || false}
        />
      </div>

      <div className="form-row">
        <label htmlFor="mainImage">Image principale</label>
        <input type="file" name="mainImage" id="mainImage" ref={eventFileRef} />
      </div>

      <input
        type="submit"
        value={`${patchMethod ? "Modifier" : "Créer"} l'article`}
        className="btn btn-primary"
      />
    </form>
  );
};

export default EventForm;
