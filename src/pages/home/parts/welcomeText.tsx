import React from "react";
import TicketFull from "../../../assets/ilustrations/landingpage/TicketFull.svg";
import Countdown from "react-countdown";
import Money1 from "../../../assets/ilustrations/landingpage/moneys/money1.svg";
import Money2 from "../../../assets/ilustrations/landingpage/moneys/money2.svg";
import Money3 from "../../../assets/ilustrations/landingpage/moneys/money3.svg";
import Money3b from "../../../assets/ilustrations/landingpage/moneys/money3b.svg";
import Money4 from "../../../assets/ilustrations/landingpage/moneys/money4.svg";
import BuyTicketButton from "../../../components/Buttons/buyTicket";
import { Link, useNavigate } from "react-router-dom";

function WelcomeText() {
  const navigate = useNavigate();
  const ItemNextDraw = ({ number }: any) => {
    return <div>{number}</div>;
  };

  const Moneys = () => {
    return (
      <div className="ContainerMoneys ">
        <img src={Money1} className="Money1" />
        <img src={Money2} className="Money2" />
        <img src={Money3} className="Money3" />
        <img src={Money3b} className="money3b" />
        <img src={Money4} className="Money4" />
      </div>
    );
  };

  const renderer: any = ({ hours, minutes, seconds, completed }: any) => {
    return (
      <div className="containerItemNextDraw">
        <ItemNextDraw number={hours > 10 ? hours : "0" + hours.toString()} />
        <span>:</span>
        <ItemNextDraw
          number={minutes > 10 ? minutes : "0" + minutes.toString()}
        />
        <span>:</span>
        <ItemNextDraw number={seconds < 10 ? "0" + seconds : seconds} />
      </div>
    );
  };

  return (
    <div className="welcomeText">
      <h4>BE THE NEXT WINNER</h4>
      <h1 className="">The f•money raffle is here!</h1>
      <h3>Connect your wallet to start</h3>
      <div className="imgContainer">
        <div className="animationFloat">
          <div
            className="pointer"
            onClick={() => navigate("/TicketDetailsScreen")}
          >
            <img src={TicketFull} />
            <h4>Get your tickets now!</h4>
            <h3>$97.254</h3>
            <h5>Megapool prize!</h5>
          </div>
          <div className="containerButtonBuyTicket">
            <BuyTicketButton className="buttonImgContainer" />
          </div>
        </div>
      </div>
      <div className="nextDraw">
        <h4>Next draw starts in</h4>
        <Countdown date={Date.now() + 5000000} renderer={renderer} />
      </div>
      <Moneys />
    </div>
  );
}

export default WelcomeText;
