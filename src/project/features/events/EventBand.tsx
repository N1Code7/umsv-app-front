import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { IClubEvent } from "../../../interfaces/interfaces";
import { mutate } from "swr";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Image from "next/image";
import { formatDate } from "../../../utils/dateFunctions";

interface IProps {
  event: IClubEvent;
  setPatchMethod: Dispatch<SetStateAction<boolean>>;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  setFocusedEvent: Dispatch<SetStateAction<IClubEvent>>;
  setRequestMessage: Dispatch<SetStateAction<{ success: string; error: string }>>;
}

const EventBand = ({
  event,
  setPatchMethod,
  setIsModalActive,
  setFocusedEvent,
  setRequestMessage,
}: IProps) => {
  //
  const axiosPrivate = useAxiosPrivate();
  const [isChevronDown, setIsChevronDown] = useState("down");

  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (!Array.from(document.querySelectorAll(".details a")).includes(e.target as Element)) {
      e.preventDefault();

      if (
        !Array.from(
          document.querySelectorAll(
            ".cta-container button, .registration-modalities a, .contacts a:nth-of-type(1), .contacts a:nth-of-type(2)"
          )
        ).includes(e.target as Element)
      ) {
        isChevronDown === "down" ? setIsChevronDown("up") : setIsChevronDown("down");
      }
    }
    e.stopPropagation();
  };

  const handleModify = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPatchMethod?.(true);
    setFocusedEvent?.(event);
    setIsModalActive?.(true);
  };

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    //
    await mutate("/events", axiosPrivate.delete(`/event/${event.id}`), {
      optimisticData: (all: Array<IClubEvent>) =>
        all
          .filter((item: IClubEvent) => item.id !== event.id)
          .sort(
            (a: IClubEvent, b: IClubEvent) =>
              Number(new Date(b.updatedAt || b.createdAt)) -
              Number(new Date(a.updatedAt || a.createdAt))
          ),
      populateCache: (result, current: Array<IClubEvent>) =>
        current.filter((item: IClubEvent) => item.id !== event.id),
      revalidate: false,
      rollbackOnError: true,
    })
      .then(() => {
        setRequestMessage({ success: "L'événement a bien été supprimé ! 👌", error: "" });
      })
      .catch((err) => {
        console.error(err);
        setRequestMessage({
          success: "",
          error: "Une erreur est survenue lors de la suppression de l'événement ! 🤕",
        });
      });

    setTimeout(() => {
      setRequestMessage({ success: "", error: "" });
    }, 10000);
    window.scrollTo(0, 0);
  };

  const handleToggleVisibility = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    //
    await mutate(
      "/events",
      await axiosPrivate
        .patch(`/event/toggle-visibility/${event.id}`)
        .then((res) => {
          setRequestMessage({
            success: "La visibilité de l'événement a bien été modifiée ! 👌",
            error: "",
          });
          return res.data;
        })
        .catch((err) => {
          console.error(err);
          setRequestMessage({
            success: "",
            error:
              "Une erreur est survenue lors de la modification de la visibilité de l'événement ! 🤕",
          });
        }),
      {
        optimisticData: (all: Array<IClubEvent>) => {
          const prev = all.filter((ev: IClubEvent) => ev.id !== event.id);
          return [...prev, { ...event, visible: !event.visible } as IClubEvent].sort(
            (a: IClubEvent, b: IClubEvent) =>
              Number(new Date(b.updatedAt || b.createdAt)) -
              Number(new Date(a.updatedAt || a.createdAt))
          );
        },
        populateCache: (newEvent: IClubEvent, all: Array<IClubEvent>) => {
          const prev = all.filter((ev: IClubEvent) => ev.id !== event.id);
          return [...prev, newEvent];
        },
        revalidate: false,
        rollbackOnError: true,
      }
    );

    setTimeout(() => {
      setRequestMessage({ success: "", error: "" });
    }, 10000);
    // window.scrollTo(0, 0);
  };

  return (
    <div className="club-event band" onClick={handleClick}>
      <div className="abstract">
        <div className="content">
          {event.content + " "}{" "}
          <strong style={{ fontWeight: 600 }}>({event.visible ? "publié" : "non publié"})</strong>
        </div>
      </div>
      <div
        className="details"
        style={
          isChevronDown === "down"
            ? { maxHeight: 0, opacity: 0, margin: 0, zIndex: "-1" }
            : { maxHeight: 500, opacity: 1, marginTop: "0.5rem", marginBottom: "0.5rem", zIndex: 0 }
        }
      >
        <i className="fa-solid fa-calendar-days"></i>
        <div className="event-dates">
          {event.endDate
            ? `Du ${formatDate(event.startDate, undefined, "XX xxx XXXX")} au 
          ${formatDate(event.endDate, undefined, "XX xxx XXXX")}`
            : `Le ${formatDate(event.startDate, undefined, "XX xxx XXXX")}`}
        </div>

        <i className="fa-solid fa-file-image"></i>
        <Image src={event.imageUrl} alt={`image de ${event.content}`} width={200} height={200} />
      </div>

      <div className="cta-container">
        <button className="btn btn-modify" onClick={handleModify}>
          ✏️
        </button>
        <button className="btn btn-modify" onClick={handleToggleVisibility}>
          👀
        </button>
        <button className="btn btn-delete" onClick={handleDelete}>
          🗑️
        </button>
      </div>

      <button onClick={handleClick}>
        <i className={`fa-solid fa-chevron-${isChevronDown}`}></i>
      </button>
    </div>
  );
};

export default EventBand;
