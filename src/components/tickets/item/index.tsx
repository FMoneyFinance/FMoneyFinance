import React from "react";
import { Link, useNavigate } from "react-router-dom";
import TicketMin from "../../../assets/ilustrations/landingpage/TicketMin.svg";
import BuyTicketButton from "../../Buttons/buyTicket";
import "./styles.scss";

function ItemTicket(props: any) {
  const navigate = useNavigate();

  const handleClick = () => {
    //navigate("/TicketDetailsScreen");
  };

  return (
    <div className="containerCard containerItemTicket" onClick={handleClick}>
      <Link to="/TicketDetailsScreen">
        <img src={TicketMin} />
        <h4>Get your tickets now!</h4>
        <h3>$5000</h3>
        <h5>Lorem ipsum dolor sit amet consectetur.</h5>
      </Link>
      <div className="containerButtonBuyTicket">
        <BuyTicketButton
          className="buttonImgContainer"
          handleBuyTicket={props?.handleBuyTicket}
        />
      </div>
    </div>
  );
}

export default ItemTicket;
