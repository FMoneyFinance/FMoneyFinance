import React from "react";
import Button from "../../../../components/Buttons";
import CalendarIcon from "../../../../assets/icons/calendar.svg";
import BuyTicketButton from "../../../../components/Buttons/buyTicket";

function HeaderTicketDetailsScreen({
  handleSeeMyRaffleSpots,
  handleBuyTicket
}: any) {
  return (
    <div className="header">
      <div className="top">
        <div className="left">
          <h3>Minipool #01 name</h3>
          <h4>Contract address: 0xC02a...6Cc21fd</h4>
        </div>
        <div className="center">
          <h3>$1669 USDC</h3>
          <h4>Prize pot</h4>
        </div>
        <div className="right">
          <BuyTicketButton
            className="buttonHeader"
            handleBuyTicket={handleBuyTicket}
            buttonProps={{ secondary: true, rounded: true }}
          />
          {/*  <Button text="Buy Tickets" className="buttonHeader" /> */}
          <div className="subright">
            <h3>
              <div className="circleTitle" /> Open raffle
            </h3>
            <h4>Status</h4>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="left">
          <h3>
            <img src={CalendarIcon} />
            <span className="bold">Date of draw:</span>
            <span>June 06, 2022. 03:55 PM (CET)</span>
          </h3>
        </div>
        <div className="right">
          <Button
            text="See your raffle spots"
            rounded
            onPress={handleSeeMyRaffleSpots}
            className="buttonSeeYourSpots"
          />
        </div>
      </div>
    </div>
  );
}

export default HeaderTicketDetailsScreen;
