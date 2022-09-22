import React, { useContext, useEffect } from "react";
import Button from "../index";
import { useState } from "react";
import BaseModal from "../../modals/base";
import "./styles.scss";
import { CheckMetamaskInstalled, handleConnectMetaMask } from "../../../web3/metamask";
import AppContext from "../../../context/AppContext";
import IconDegrade from "../../../assets/icons/circleDegrade.svg";
import { FormatWalletAddress } from "../../../utils/formater/string";
import ModalConnectWallet from "../../modals/connectWallet";

function ConnectWallet() {
  let context: any = useContext(AppContext);

  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <ModalConnectWallet {...{ showModal, setShowModal }} />
      {context?.walletAddress ? (
        <h5 className="walletAddressTxt">
          {FormatWalletAddress(context?.walletAddress)}
          <img src={IconDegrade} />
        </h5>
      ) : (
        <Button text={"Connect wallet"} onPress={handleClick} />
      )}
    </>
  );
}

export default ConnectWallet;
