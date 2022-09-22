import React, { useContext, useEffect } from "react";
import BaseModal from "../base";
import Metamask from "../../../assets/icons/metamask.svg";
import AppContext from "../../../context/AppContext";
import { handleConnectMetaMask } from "../../../web3/metamask";

function ModalConnectWallet({ showModal, setShowModal }: any) {
  const context: any = useContext(AppContext);

  const handleMetamaskConnect = async () => {
    const response = await handleConnectMetaMask();
    context.changeContext({ walletAddress: response });

    setShowModal(false);
  };

  const Footer = () => {
    return (
      <div className="footer">
        <h5>Haven’t got a crypto wallet yet?</h5>
      </div>
    );
  };

  const configModal = {
    title: "Connect wallet",
    buttonTxt: "Learn how to connect",
    setShowModal,
    offset: {
      top: "3.7vh",
      right: "12vw"
    },
    footer: Footer
  };

  return (
    <BaseModal showModal={showModal} config={configModal}>
      <div className="modalConnectWallet">
        <div className="walletContainer" onClick={handleMetamaskConnect}>
          <img src={Metamask} />
          <h5>Metamask</h5>
        </div>
      </div>
    </BaseModal>
  );
}

export default ModalConnectWallet;
