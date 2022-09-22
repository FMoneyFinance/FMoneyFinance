import React, { useContext, useState } from "react";
import FullModal from "../../components/modals/base/full";
import BuyTicketsModal from "../../components/modals/buyTickets";
import ModalConnectWallet from "../../components/modals/connectWallet";
import RafflePoints from "../../components/raffle/points";
import AppContext from "../../context/AppContext";
import MainLayout from "../../layouts/main";
import GraphTicketDetails from "./parts/graph";
import HeaderTicketDetailsScreen from "./parts/header";
import MiniPools from "./parts/minipools/minipools";
import RaffleSpots from "./parts/raffleSpots";
import "./styles.scss";

function BannerAdd() {
  return (
    <div className="adBannerContainer">
      <h3>Banner ad</h3>
    </div>
  );
}

function TicketDetailsScreen() {
  const [showRaffleSpots, setShowRaffleSpots] = useState(false);
  const [showButTicketModal, setShowButTicketModal] = useState(false);
  const [showModalConnectWallet, setShowModalConnectWallet] = useState(false);
  const context: any = useContext(AppContext);

  const configModalSeeMyRaffles = {
    title: "Your raffle spots",
    buttonTxt: "Buy more spots",
    setShowModal: setShowRaffleSpots,
    offset: {
      top: "3.7vh",
      right: "12vw"
    },
    styles: {
      minWidth: "28vw"
    }
  };
  const configModalBuyTicket = {
    title: "Buy tickets",
    buttonTxt: "Buy now",
    classButton: "buttonModalBuyTickets",
    styles: {
      width: "40vw",
      minHeight: "77vh"
    },
    setShowModal: setShowButTicketModal
  };

  const handleSeeMyRaffleSpots = () => {
    setShowRaffleSpots(true);
  };

  const handleBuyTicket = () => {
    if (!context?.walletAddress) {
      setShowModalConnectWallet(true);
    } else {
      setShowButTicketModal(true);
    }
  };

  const SeeMyRaffles = () => {
    return (
      <>
        <div className="containerRafflePointsModal">
          <RafflePoints number="01" />
          <RafflePoints number="34" />
          <RafflePoints number="45" />
          <RafflePoints number="88" />
          <RafflePoints number="101" />
        </div>

        <h3 className="titleRafflePointsModal">
          <span>Draw:</span> June 06, 2022. 03:55 PM (CET)
        </h3>
      </>
    );
  };

  return (
    <MainLayout>
      <div className="TicketDetailsScreen">
        <BannerAdd />
        <HeaderTicketDetailsScreen
          {...{ handleSeeMyRaffleSpots, handleBuyTicket }}
        />
        <GraphTicketDetails />
        <RaffleSpots {...{ handleBuyTicket }} />
        <MiniPools {...{ handleBuyTicket }} />
        <BannerAdd />
        {showRaffleSpots && (
          <FullModal
            showModal={showRaffleSpots}
            config={configModalSeeMyRaffles}
          >
            <SeeMyRaffles />
          </FullModal>
        )}
        <ModalConnectWallet
          {...{
            showModal: showModalConnectWallet,
            setShowModal: setShowModalConnectWallet
          }}
        />

        {showButTicketModal && (
          <FullModal
            showModal={showButTicketModal}
            config={configModalBuyTicket}
          >
            <BuyTicketsModal />
          </FullModal>
        )}
      </div>
    </MainLayout>
  );
}

export default TicketDetailsScreen;
