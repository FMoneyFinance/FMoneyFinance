import React from "react";
import "../styles.scss";

function RafflePoints({ number, block }: any) {
  return (
    <h4 className={`containerRafflePoint block-${block}`}>
      {number < 10 ? "0" + number : number}
    </h4>
  );
}

export default RafflePoints;
