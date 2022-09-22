import React from "react";
import BaseModal from "./index";
import "./index.scss";

export default function FullModal({ showModal, children, config }: any) {
  config.styles = {
    ...config?.styles,
    position: "relative",
    right: "inherit",
    top: "inherit"
  };

  return (
    <div className="fullModalContainer">
      <BaseModal {...{ showModal, children, config }} />
    </div>
  );
}
