import React from "react";
import Button from "../../../../components/Buttons";

function RaffleSpots({ handleBuyTicket }: any) {
  const Table = () => {
    const Header = () => {
      return (
        <div className="headerTable">
          <div>
            <h3 className="left"># Spot</h3>
          </div>
          <div>
            <h3 className="center">Player address</h3>
          </div>
          <div>
            <h3 className="right">Select spots to buy a bulk</h3>
          </div>
        </div>
      );
    };

    const Row = ({ active }: any) => {
      return (
        <div className="row">
          <div className={`left active-${active}`}>
            <h4>01</h4>
          </div>
          <div className="center">
            <h4>
              {active
                ? "0x59406ad8326d539c2d9f39e1d37f2434b4c364bf"
                : "Available"}
            </h4>
          </div>
          <div className="right">
            <Button
              text="Buy spot"
              className={"active-" + active}
              onPress={handleBuyTicket}
              rounded
            />
            <div className={`square active-square-${active}`}></div>
          </div>
        </div>
      );
    };

    return (
      <div className="table">
        <Header />
        <Row />
        <Row active />
        <Row />
        <Row active />
        <Row />
        <Row />
        <Row active />
        <Row />
        <Row active />
      </div>
    );
  };

  return (
    <div className="RaffleSpots">
      <h2>Raffle spots</h2>
      <h4>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium
      </h4>
      <Table />
    </div>
  );
}

export default RaffleSpots;
