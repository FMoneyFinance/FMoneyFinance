import React, { useContext } from "react";
import Button from "../index";
import { useState } from "react";
import BaseModal from "../../modals/base";
import "./styles.scss";
import Metamask from "../../../assets/icons/metamask.svg";
import AppContext from "../../../context/AppContext";
import ModalConnectWallet from "../../modals/connectWallet";

function BuyTicketButton({ className, handleBuyTicket, buttonProps }: any) {
  const context: any = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (!context?.walletAddress) {
      setShowModal(!showModal);
    } else {
      handleBuyTicket();
    }
  };

  return (
    <>
      <ModalConnectWallet {...{ showModal, setShowModal }} />
      <Button
        text={"Buy ticket"}
        onPress={handleClick}
        {...buttonProps}
        className={className}
      />
    </>
  );
}

export default BuyTicketButton;
