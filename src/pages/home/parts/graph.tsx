import React from "react";
import GraphLines from "../../../components/graph/lines/index";
import Money5 from "../../../assets/ilustrations/landingpage/moneys/money5.svg";
import Money6 from "../../../assets/ilustrations/landingpage/moneys/money6.svg";

function GraphWelcome() {
  const width = window.innerWidth;

  const Moneys = () => {
    return (
      <div className="ContainerMoneys">
        <img src={Money5} className="Money5" />
        <img src={Money6} className="Money6" />
      </div>
    );
  };

  return (
    <div className="graphContainer">
      <h2>Prize pot evolution</h2>
      <h4>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium
      </h4>
      <div className="graph" style={{ width: width * 0.6 }}>
        <GraphLines />
      </div>
      <Moneys />
    </div>
  );
}

export default GraphWelcome;
