import React from "react";
import { Link } from "react-router-dom";
import LogoMin from "../../assets/logos/main.gif";
import "./styles.scss";

function Logo() {
  return (
    <Link to="/">
      <div className="ContainerLogo">
        <img src={LogoMin} />
        <span>Money</span>
      </div>
    </Link>
  );
}

export default Logo;
