import React from "react";
import "./styles.scss";
import { useTranslation } from "react-i18next";
function AllRights() {
  const { t } = useTranslation();

  return (
    <div className="containerAllRights">
      <div className="links flex">
        <span className="pointer">Community</span>
        <span className="pointer">Whitepaper</span>
        <span className="pointer">Contact us</span>
      </div>
      <div className="allRightsReserved">
        <h2>FMoney | {t("allRightsReserved.text")} ©</h2>
      </div>
    </div>
  );
}

export default AllRights;
