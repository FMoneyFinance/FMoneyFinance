import React from "react";
import Divider from "../../elements/divider";
import RafflePoints from "../../raffle/points";
import "./styles.scss";

function BuyTicketsModal() {
  const Header = () => {
    return (
      <div className="header">
        <h3 className="left">Select spots to buy:</h3>
        <h3 className="right">Show only available spots</h3>
      </div>
    );
  };

  const Points = () => {
    const pointsList: any = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
    ];
    return (
      <div className="gridPoints">
        {pointsList.map((point: number) => {
          return <RafflePoints block={point % 3 === 0} number={point} />;
        })}
      </div>
    );
  };

  const Data = () => {
    const SubItem = ({ text, value }: any) => {
      return (
        <div className="subitem">
          <h3>{text}</h3>
          <h3>{value}</h3>
        </div>
      );
    };

    return (
      <div className="dataContainer">
        <SubItem text="Cost (FMON)" value="-4,772.74 FMON" />
        <SubItem text="0.4% Bulk discount:" value="~329 FMON" />
        <Divider />
        <div className="MainItem">
          <h3>You pay:</h3>
          <h3 className="strong">~4,448.74 FMON</h3>
        </div>
      </div>
    );
  };

  return (
    <div className="modalBuyTicketsModal">
      <Header />
      <Points />
      <Data />
    </div>
  );
}

export default BuyTicketsModal;
