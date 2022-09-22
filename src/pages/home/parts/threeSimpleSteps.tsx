import React from "react";

import Ilustration from "../../../assets/ilustrations/landingpage/ticketanddivider.svg";

function ThreeSimpleSteps() {
  const Item = ({ title, description, icon }: any) => {
    return (
      <div className="containerItem">
        <div className="icon">{icon}</div>
        <div className="title">{title}</div>
        <div className="description">{description}</div>
      </div>
    );
  };

  return (
    <div className="ThreeSimpleSteps">
      <h4>HOW TO PLAY</h4>
      <h2>Three simple steps</h2>
      <div className="containerItems">
        <Item
          title="Buy tickets"
          description="Once the round’s over, come back to the page and check to see if you’ve won!"
          icon="1"
        />
        <Item
          title="Wait for the draw"
          description="Once the round’s over, come back to the page and check to see if you’ve won!"
          icon="2"
        />
        <Item
          title="Check for prizes"
          description="Once the round’s over, come back to the page and check to see if you’ve won!"
          icon="3"
        />
      </div>

      <img src={Ilustration} />
    </div>
  );
}

export default ThreeSimpleSteps;
