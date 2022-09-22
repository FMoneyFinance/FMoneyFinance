import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
// import { useDetectClickOutside } from "react-detect-click-outside";

import "./styles.scss";

function DropDown({ changeLanguageES, changeLanguageEN }: any) {
  const { i18n } = useTranslation();

  return (
    <div>
      <div className="containerDropDown">
        <div onClick={changeLanguageEN}>
          <p>
            {i18n.language === "en" ? (
              <strong>English (EN)</strong>
            ) : (
              "English (EN)"
            )}
          </p>
        </div>
        <div onClick={changeLanguageES}>
          <p>
            {i18n.language === "es" ? (
              <strong>Español (ES)</strong>
            ) : (
              "Español (ES)"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DropDown;
