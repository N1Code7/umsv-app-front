import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

const MemberHeader = () => {
  const { user } = useContext(AuthenticationContext);

  const [colorFeather, setColorFeather] = useState("");
  const [rankingColor, setRankingColor] = useState("");

  useEffect(() => {
    switch (user?.feather) {
      case "Plume blanche":
        setColorFeather("white");
        break;
      case "Plume jaune":
        setColorFeather("yellow");
        break;
      case "Plume verte":
        setColorFeather("green");
        break;
      case "Plume bleue":
        setColorFeather("blue");
        break;
      case "Plume rouge":
        setColorFeather("#c23131");
        break;

      default:
        break;
    }

    if (["N1", "N2", "N3"].includes(user?.rankings?.single?.rankName || "")) {
      setRankingColor("#fb6161");
    } else if (["R4", "R5", "R6"].includes(user?.rankings?.single?.rankName || "")) {
      setRankingColor("#65aef4");
    } else if (["R4", "R5", "R6"].includes(user?.rankings?.single?.rankName || "")) {
      setRankingColor("#1bbe1b");
    } else {
      setRankingColor("#d7da1e");
    }
  }, [user]);

  return (
    <div className="member-header">
      <h1>Bonjour {user?.firstName}</h1>
      <div className="member-infos">
        <div className="license">Licence : {user?.license}</div>
        {user?.license !== "" && (
          <div className="feather">
            Plume : <i className="fa-solid fa-feather-pointed" style={{ color: colorFeather }}></i>
          </div>
        )}
        <div className="category">Catégorie : {user?.category?.long}</div>
        {user?.isPlayerTransferred && <div className="transferred">Muté(e)</div>}
      </div>
      {/* Insert logic for gender when data will be set on Cookies */}
      <div className="classifications">
        <div className="classification classification-single">
          <div className="classification-name" style={{ background: rankingColor }}>
            {user?.rankings?.single?.rankName}
          </div>
          <div className="classification-cpph">{user?.rankings?.single?.cpph}</div>
          <div className="classification-rank">{user?.rankings?.single?.rankNumber}</div>
          <div className="classification-table">Simple</div>
        </div>
        <div className="classification classification-double">
          <div className="classification-name" style={{ background: rankingColor }}>
            {user?.rankings?.double?.rankName}
          </div>
          <div className="classification-cpph">{user?.rankings?.double?.cpph}</div>
          <div className="classification-rank">{user?.rankings?.double?.rankNumber}</div>
          <div className="classification-table">Double</div>
        </div>
        <div className="classification classification-mixed">
          <div className="classification-name" style={{ background: rankingColor }}>
            {user?.rankings?.mixed?.rankName}
          </div>
          <div className="classification-cpph">{user?.rankings?.mixed?.cpph}</div>
          <div className="classification-rank">{user?.rankings?.mixed?.rankNumber}</div>
          <div className="classification-table">Mixte</div>
        </div>
        <div className="classification-date">classements au {user?.rankings?.effectiveDate}</div>
      </div>
    </div>
  );
};

export default MemberHeader;
