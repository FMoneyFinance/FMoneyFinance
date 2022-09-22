import React, { useState } from "react";
import Button from "../../../../components/Buttons";
import arrowUpRight from "../../../../assets/icons/arrowUpRight.svg";
import github from "../../../../assets/icons/github.svg";
import { useTranslation } from "react-i18next";
import { Viewport } from "react-is-in-viewport";

function ComunityScreen() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  function abrirLink() {
    return window.open(
      "https://github.com/FMoneyFinance/FMoneyFinance",
      "_blank"
    );
  }

  return (
    <div>
      <Viewport type="fit" onEnter={() => setVisible(true)}>
        <div className="containerComunity">
          <div className="containerText">
            <div>
              <h1>
                {t("comunity.title")}
                <br />
              </h1>
            </div>
            <br />
            <div className="flex">
              <div className="textComunity">
                <h5>{t("comunity.text")}</h5>
                <h5>{t("comunity.text2")}</h5>
              </div>
              <div className="containerButton flex">
                <Button
                  onPress={() => abrirLink()}
                  text={t("comunity.buttonGithub")}
                  iconLeft={github}
                  iconRight={arrowUpRight}
                />
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </Viewport>
    </div>
  );
}

export default ComunityScreen;
