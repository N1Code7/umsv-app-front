import { useContext } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

const MemberHeader = () => {
  const { user } = useContext(AuthenticationContext);
  const rankingsColor = {
    red: "#fb6161",
    blue: "#65aef4",
    green: "#1bbe1b",
    yellow: "#d7da1e",
  };
  const latestStats = user?.FFBadStats?.[user?.FFBadStats?.length - 1];

  const adaptRankColor = (rank?: string) => {
    if (rank?.includes("N")) {
      return rankingsColor.red;
    } else if (rank?.includes("R")) {
      return rankingsColor.blue;
    } else if (rank?.includes("D")) {
      return rankingsColor.green;
    } else if (rank?.includes("P")) {
      return rankingsColor.yellow;
    } else {
      return "transparent";
    }
  };

  const adaptFeatherColor = (feather?: string) => {
    switch (feather) {
      case "Plume blanche":
        return "white";
      case "Plume jaune":
        return "yellow";
      case "Plume verte":
        return "green";
      case "Plume bleue":
        return "blue";
      case "Plume rouge":
        return "red";

      default:
        break;
    }
  };

  return (
    <div className="member-header">
      <h1>Bonjour {user?.firstName}</h1>
      <div className="member-infos">
        <div className="license">Licence : {latestStats?.license}</div>
        {latestStats?.feather && (
          <div className="feather">
            Plume :{" "}
            <i
              className="fa-solid fa-feather-pointed"
              style={{ color: adaptFeatherColor(latestStats.feather) }}
            ></i>
          </div>
        )}
        <div className="category">Catégorie : {latestStats?.categoryLong}</div>
        {latestStats?.isPlayerTransferred &&
          (user?.gender ? (
            user?.gender === "male" ? (
              <div className="transferred">Muté</div>
            ) : (
              <div className="transferred">Mutée</div>
            )
          ) : (
            <div className="transferred">Muté(e)</div>
          ))}
      </div>
      {/* Insert logic for gender when data will be set on Cookies */}
      <div className="classifications">
        <div className="classification classification-single">
          <div
            className="classification-name"
            style={{ background: adaptRankColor(latestStats?.singleRankName) }}
          >
            {latestStats?.singleRankName}
          </div>
          <div className="classification-cpph">{latestStats?.singleCPPH}</div>
          <div className="classification-rank">{latestStats?.singleRankNumber}</div>
          <div className="classification-table">Simple</div>
        </div>
        <div className="classification classification-double">
          <div
            className="classification-name"
            style={{ background: adaptRankColor(latestStats?.doubleRankName) }}
          >
            {/* <div className="classification-name" style={{ background: rankingColor }}> */}
            {latestStats?.doubleRankName}
          </div>
          <div className="classification-cpph">{latestStats?.doubleCPPH}</div>
          <div className="classification-rank">{latestStats?.doubleRankNumber}</div>
          <div className="classification-table">Double</div>
        </div>
        <div className="classification classification-mixed">
          <div
            className="classification-name"
            style={{ background: adaptRankColor(latestStats?.mixedRankName) }}
          >
            {latestStats?.mixedRankName}
          </div>
          <div className="classification-cpph">{latestStats?.mixedCPPH}</div>
          <div className="classification-rank">{latestStats?.mixedRankNumber}</div>
          <div className="classification-table">Mixte</div>
        </div>
        <div className="classification-date">classements au {latestStats?.rankingsDate}</div>
      </div>
    </div>
  );
};

export default MemberHeader;
