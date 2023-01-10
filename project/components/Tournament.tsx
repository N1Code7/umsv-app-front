import { MouseEvent, useState } from "react";
import { formatDate } from "../../config/functions";
import { ITournament, ITournamentRegistration } from "../../config/interfaces";
import { Document, Page } from "react-pdf";

interface ITournamentProps {
  tournament: ITournament;
  onMobile: boolean;
}

const Tournament = ({ tournament, onMobile }: ITournamentProps) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [display, setDisplay] = useState(false);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDisplay(!display);
  };

  return onMobile ? (
    <div className="tournament card">
      <div className="name">{tournament.name}</div>
      <div className="city">{tournament.city}</div>
      <div className="dates">
        {formatDate(tournament.startDate, tournament.endDate, "XX & XX xxx XXXX")}
      </div>
      <div className="cta-container">
        <a href={tournament.regulationFileUrl} className="btn see-file" download={true}>
          📄
        </a>
        <button className="btn register">➕</button>
      </div>
    </div>
  ) : (
    <>
      <tr className="tournament">
        <td>{formatDate(tournament.startDate, tournament.endDate, "XX & XX xxx XXXX")}</td>
        <td>{tournament.name}</td>
        <td>{tournament.city}</td>
        <td>
          {new Date(tournament.registrationClosingDate).getTime() - new Date().getTime() < 0
            ? "🙅"
            : formatDate(tournament.registrationClosingDate, "XX/XX/XX")}
        </td>
        <td>
          {new Date(tournament.randomDraw).getTime() - new Date().getTime() < 0
            ? "🙅"
            : formatDate(tournament.randomDraw, "XX/XX/XX")}
        </td>
        <td>
          {tournament.tournamentRegistrations.filter(
            (registration: ITournamentRegistration) =>
              registration.tournamentId === tournament.id &&
              registration.requestState === "validated"
          ).length + 1}
        </td>
        <td>
          <div className="cta-container">
            <button className="btn see-file" onClick={handleClick}>
              📄
            </button>
            <button className="btn register">➕</button>
          </div>
        </td>
      </tr>
      {/* <Document file={tournament.regulationFileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={numPages} />
      </Document> */}

      {/* <div style={display ? { display: "block" } : { display: "none" }}>
        <Document file={tournament.regulationFileUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </div> */}
    </>
  );
};

export default Tournament;
