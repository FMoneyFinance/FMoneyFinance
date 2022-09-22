import React from "react";
import Mainlogo from "../../assets/logos/main.svg";
import "./styles.scss";

function SplashScreen() {
  return (
    <div className="splash-container">
      <img src={Mainlogo} />
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default SplashScreen;
