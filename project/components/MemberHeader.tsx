import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import { fetchFFBAD } from "../../config/functions";

const MemberHeader = () => {
  const { user, setUser } = useContext(AuthenticationContext);

  const [data, setData] = useState([]);
  const [colorFeather, setColorFeather] = useState("");
  const [formatedDate, setFormatedDate] = useState("");

  // useEffect(() => {
  //   fetch("data.json", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((res) => Object.values(res.Retour))
  //     .then((res: any) =>
  //       setData(res.filter((elt: any) => elt.PER_NOM == "GANCI" && elt.PER_PRENOM == "Charlotte"))
  //     );
  // }, []);

  useEffect(() => {
    fetchFFBAD()
      .then((res) => console.log(res.json()))
      .catch((err) => console.log(err));
  });

  useEffect(() => {
    switch (String(data.map((elt: any) => elt.PLUME_NOM))) {
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

    let [y, m, d] = String(data.map((elt: any) => elt.DATE)).split("-");
    setFormatedDate([d, m, y].join("/"));
  }, [data]);

  return (
    <div className="member-header">
      <h1>Bonjour {user?.firstName}</h1>
      {/* <h1>Bonjour {data.map((elt: any) => elt.PER_PRENOM)}</h1> */}
      <div className="member-infos">
        <div className="licence">Licence : {data.map((elt: any) => elt.PER_LICENCE)}</div>
        {String(data.map((elt: any) => elt.PLUME_NOM)) !== "" && (
          <div className="feather">
            Plume : <i className="fa-solid fa-feather-pointed" style={{ color: colorFeather }}></i>
          </div>
        )}
        <div className="category">Catégorie : {data.map((elt: any) => elt.JOC_NOM_LONG)}</div>
        {String(data.map((elt: any) => elt.JOU_IS_MUTE)) === "1" && (
          <div className="transfered">{"man" === "man" ? "Muté" : "Mutée"}</div>
        )}
      </div>
      {/* Insert logic for gender when data will be set on Cookies */}
      <div className="classifications">
        <div className="classification classification-single">
          <div className="classification-name">{data.map((elt: any) => elt.SIMPLE_NOM)}</div>
          <div className="classification-cpph">29923,65</div>
          {/* <div className="classification-cpph">{data.map((elt: any) => elt.SIMPLE_COTE_FFBAD)}</div> */}
          <div className="classification-rank">{data.map((elt: any) => elt.SIMPLE_RANG)}</div>
          <div className="classification-table">Simple</div>
        </div>
        <div className="classification classification-double">
          <div className="classification-name">{data.map((elt: any) => elt.DOUBLE_NOM)}</div>
          <div className="classification-cpph">{data.map((elt: any) => elt.DOUBLE_COTE_FFBAD)}</div>
          <div className="classification-rank">{data.map((elt: any) => elt.DOUBLE_RANG)}</div>
          <div className="classification-table">Double</div>
        </div>
        <div className="classification classification-mixed">
          <div className="classification-name">{data.map((elt: any) => elt.MIXTE_NOM)}</div>
          <div className="classification-cpph">{data.map((elt: any) => elt.MIXTE_COTE_FFBAD)}</div>
          <div className="classification-rank">{data.map((elt: any) => elt.MIXTE_RANG)}</div>
          <div className="classification-table">Mixte</div>
        </div>
        <div className="classification-date">classements au {formatedDate}</div>
      </div>
    </div>
  );
};

export default MemberHeader;
