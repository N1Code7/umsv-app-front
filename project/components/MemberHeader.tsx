import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

const MemberHeader = () => {
  const { user } = useContext(AuthenticationContext);

  const [colorFeather, setColorFeather] = useState("");

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
  }, [user]);

  return (
    <div className="member-header">
      <h1>Bonjour {user?.firstName}</h1>
      {/* <h1>Bonjour {data.map((elt: any) => elt.PER_PRENOM)}</h1> */}
      <div className="member-infos">
        <div className="licence">Licence : {user?.license}</div>
        {user?.license !== "" && (
          <div className="feather">
            Plume : <i className="fa-solid fa-feather-pointed" style={{ color: colorFeather }}></i>
          </div>
        )}
        <div className="category">Catégorie : {user?.category?.long}</div>
        {user?.isPlayerTransferred && <div className="transfered">Muté(e)</div>}
      </div>
      {/* Insert logic for gender when data will be set on Cookies */}
      <div className="classifications">
        <div className="classification classification-single">
          <div className="classification-name">{user?.rankings?.single?.rankName}</div>
          <div className="classification-cpph">{user?.rankings?.single?.cpph}</div>
          <div className="classification-rank">{user?.rankings?.single?.rankNumber}</div>
          <div className="classification-table">Simple</div>
        </div>
        <div className="classification classification-double">
          <div className="classification-name">{user?.rankings?.double?.rankName}</div>
          <div className="classification-cpph">{user?.rankings?.double?.cpph}</div>
          <div className="classification-rank">{user?.rankings?.double?.rankNumber}</div>
          <div className="classification-table">Double</div>
        </div>
        <div className="classification classification-mixed">
          <div className="classification-name">{user?.rankings?.mixed?.rankName}</div>
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
