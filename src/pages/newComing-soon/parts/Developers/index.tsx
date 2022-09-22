import React, { useState } from "react";
/* GRAY COINS */
import coin1 from "../../../../assets/ilustrations/newComingSoon/coin1.svg";
import coin2 from "../../../../assets/ilustrations/newComingSoon/coin2.svg";
import coin3 from "../../../../assets/ilustrations/newComingSoon/coin3.svg";
import coin4 from "../../../../assets/ilustrations/newComingSoon/coin4.svg";
import coin5 from "../../../../assets/ilustrations/newComingSoon/coin5.svg";
import coin6 from "../../../../assets/ilustrations/newComingSoon/coin6.svg";
/* FULL COLOR COINS */
import coinFullColor1 from "../../../../assets/ilustrations/newComingSoon/coinFullColor1.svg";
import coinFullColor2 from "../../../../assets/ilustrations/newComingSoon/coinFullColor2.svg";
import coinFullColor3 from "../../../../assets/ilustrations/newComingSoon/coinFullColor3.svg";
import coinFullColor4 from "../../../../assets/ilustrations/newComingSoon/coinFullColor4.svg";
import coinFullColor5 from "../../../../assets/ilustrations/newComingSoon/coinFullColor5.svg";
import coinFullColor6 from "../../../../assets/ilustrations/newComingSoon/coinFullColor6.svg";
import twitterIcon from "../../../../assets/icons/twitterGray.svg";
import { useTranslation } from "react-i18next";
import { Viewport } from "react-is-in-viewport";

function DeveloperScreen() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const CoinsDevelopers = ({
    coinIMG,
    name,
    socialMedia,
    coinFullColor,
    animation,
    delay,
    link
  }: any) => {
    const openLink = () => {
      window.open(link, "_blank");
    };

    return (
      <div
        onClick={() => openLink()}
        className={
          visible
            ? `containerCoin pointer animate__${
                animation || "bounce"
              } animate__delay-${delay || "0s"}`
            : "containerCoin"
        }
      >
        <img src={coinIMG} alt="coin" className="coin pointer" />

        <img
          src={coinFullColor}
          alt="coinFullColor"
          className="coin pointer coinFullColor"
        />

        <span className="pointer">{name}</span>
        <div className="socialMedia pointer">
          <img src={socialMedia} alt="twitter" />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="containerDevelopers">
        <Viewport type="fit" onEnter={() => setVisible(true)}>
          <div className="containerText ">
            <h1>
              {t("developers.title")}
              <br />
            </h1>
            <br />
            <h5>{t("developers.text")}</h5>
            <h5>{t("developers.text2")}</h5>
            <h5>{t("developers.text3")}</h5>
          </div>

          <div className="containerAllDevelopers flex">
            <CoinsDevelopers
              name="xPresident I"
              coinIMG={coin1}
              coinFullColor={coinFullColor1}
              socialMedia={twitterIcon}
              animation={"fadeInUp"}
              link="https://twitter.com/xPresidentI"
            />
            <CoinsDevelopers
              name="xPresident II"
              coinIMG={coin2}
              coinFullColor={coinFullColor2}
              socialMedia={twitterIcon}
              animation={"fadeInUp"}
              delay={"1s"}
              link="https://twitter.com/xPresidentII"
            />
            <CoinsDevelopers
              name="xPresident III"
              coinIMG={coin3}
              coinFullColor={coinFullColor3}
              socialMedia={twitterIcon}
              animation={"fadeInUp"}
              delay={"2s"}
              link="https://twitter.com/xPresidentIII"
            />
            <CoinsDevelopers
              name="xPresident IV"
              coinIMG={coin4}
              coinFullColor={coinFullColor4}
              socialMedia={twitterIcon}
              animation={"fadeInUp"}
              delay={"3s"}
              link="https://twitter.com/xPresidentIV"
            />
            <CoinsDevelopers
              name="xPresident V"
              coinIMG={coin5}
              coinFullColor={coinFullColor5}
              socialMedia={twitterIcon}
              animation={"fadeInUp"}
              delay={"4s"}
              link="https://twitter.com/xPresidentV"
            />
            <CoinsDevelopers
              name="xPresident VI"
              coinIMG={coin6}
              coinFullColor={coinFullColor6}
              socialMedia={twitterIcon}
              animation={"fadeInUp"}
              delay={"5s"}
              link="https://twitter.com/xPresidentVI"
            />
          </div>
        </Viewport>
      </div>
    </div>
  );
}

export default DeveloperScreen;
