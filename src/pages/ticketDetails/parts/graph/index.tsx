import React from "react";
import GraphLines from "../../../../components/graph/lines";
import Money5 from "../../../../assets/ilustrations/landingpage/moneys/money5.svg";
import Money6 from "../../../../assets/ilustrations/landingpage/moneys/money6.svg";
import ClockIcon from "../../../../assets/icons/clock.svg";

function GraphTicketDetails() {
  const width = window.innerWidth;

  const Moneys = () => {
    return (
      <div className="ContainerMoneys">
        <img src={Money5} className="Money5" />
      </div>
    );
  };

  const Table = () => {
    const Item = ({ title, txt }: any) => {
      return (
        <div className="itemTable">
          <h4>{title}</h4>
          <h3>{txt}</h3>
        </div>
      );
    };

    return (
      <div className="containerTable">
        <Item title="Current acumulated prize:" txt="$1669 USDC" />
        <Item title="Price of the ticket" txt="$50 USDC" />
        <Item title="Maximum numbers of players:" txt="900" />
        <Item title="Current numbers of players:" txt="532" />
        <Item title="Percentage of prize to operator" txt="20%" />
      </div>
    );
  };

  return (
    <div className="graphContainer">
      <div className="graph">
        <GraphLines config={{ width: window.innerWidth * 0.5 }} />
      </div>
      <div className="dateToExpire">
        <h4>
          <img src={ClockIcon} /> 7d 14h 54m until the draw
        </h4>
      </div>
      <Table />
      <Moneys />
    </div>
  );
}

export default GraphTicketDetails;
