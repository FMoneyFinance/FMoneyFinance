import React from "react";
import "./index.scss";
import Close from "../../../assets/icons/close.svg";
import Divider from "../../elements/divider";
import Button from "../../Buttons";

function BaseModal({ showModal, children, config }: any) {
  const styleActive = {
    opacity: showModal ? 1 : 0,
    width: showModal ? config?.width || "24vw" : 0,
    zIndex: showModal ? config?.zIndex || 1 : -5000,
    minHeight: showModal ? config?.height || "50vh" : 0
  };

  const Header = () => {
    return (
      <div className="header">
        <h4 id="titleHeader">
          <img className="hidden" src={Close} /> {config?.title}
          <img src={Close} onClick={() => config?.setShowModal(false)} />
        </h4>
        <Divider config={{ width: "90%" }} />
      </div>
    );
  };

  return (
    <div
      className="containerModal"
      style={{ ...styleActive, ...config?.offset, ...config?.styles }}
    >
      <Header />
      {children}
      <div className="containerButtonModal">
        {config?.footer && config?.footer()}
        <Button
          text={config?.buttonTxt}
          className={"buttonModalFooter " + config?.classButton}
        />
      </div>
    </div>
  );
}

export default BaseModal;
