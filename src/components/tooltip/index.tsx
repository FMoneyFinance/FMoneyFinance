import React from "react";
import copy from "../../assets/icons/copySuccess.svg";
import "./styles.scss";

function ToolTip({ text, walletModal, className }: any) {
  return (
    <div
      className={
        walletModal
          ? "containerPopper walletModal " + className
          : "containerPopper " + className
      }
    >
      <div className="flex">
        <h5>{text}</h5>
        <img src={copy} alt="copy" />
      </div>
    </div>
  );
}

export default ToolTip;
