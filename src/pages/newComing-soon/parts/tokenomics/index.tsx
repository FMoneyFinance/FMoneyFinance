import React, { useEffect, useState } from "react";
import arrowUpRight from "../../../../assets/icons/arrowUpRight.svg";
import copy from "../../../../assets/icons/copy.svg";
import open from "../../../../assets/icons/open.svg";
import Fire from "../../../../assets/icons/fire.svg";
import Coin from "../../../../assets/icons/coin.svg";
import MoneyBag from "../../../../assets/icons/moneyBag.svg";
import FireWhite from "../../../../assets/icons/fireWhite.svg";
import CoinWhite from "../../../../assets/icons/coinWhite.svg";
import MoneyBagWhite from "../../../../assets/icons/moneyBagWhite.svg";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/Buttons";
import { MobileView, isTablet } from "react-device-detect";
import SocialMediaList from "../../../../components/socialMedia/socialMediaList";
import { Viewport } from "react-is-in-viewport";
import ToolTip from "../../../../components/tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactTooltip from "react-tooltip";

function TokenomicsScreen() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tooltip, showTooltip] = useState(true);

  const timeOut = setTimeout(() => {
    setCopied(false);
  }, 2000);

  const handleCopy = () => {
    console.log("hola");

    setCopied(true);
    timeOut;
  };

  function abrirLink() {
    return window.open("https://fmoney.gitbook.io/money/", "_blank");
  }

  const ItemsTokenomics = ({ text, icon, icon2, animation, delay }: any) => {
    const [hover, setHover] = useState(false);

    return (
      <div
        className="ItemTokenomic fadeInUp"
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <div
          className={`animate__${animation || "fadeInUp"} animate__delay-${
            delay || "0s"
          } `}
        >
          <h4>
            <img src={hover ? icon2 : icon} alt={text} />
            <span>{text}</span>
          </h4>
        </div>
      </div>
    );
  };

  const TotalFmoneySupply = () => {
    return (
      <div className="containerTotalFmoneySupply">
        <div className="title">
          <h5 className="animate__rollIn">{t("tokenomics.totalSupply")}</h5>
        </div>

        <div className="TotalSupply  animate__rollIn animate__delay-1s">
          <h2>10,000,000,000 FMON</h2>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="containerTokenomics">
        <MobileView>
          <div className="MobileViewSocialMedia">
            {!isTablet && <SocialMediaList />}
          </div>
        </MobileView>
        <div className="containerText">
          <h1>
            Tokenomics
            <br />
          </h1>
          <br />
          <h5>{t("tokenomics.text")}</h5>
        </div>
        <br />
        <div className="tokenomics">
          <Viewport type="fit" onEnter={() => setVisible(true)}>
            <div className="containerItemsTokenomics flex">
              <ItemsTokenomics text="1% Burn" icon={Fire} icon2={FireWhite} />
              <ItemsTokenomics
                text="1% Reflections"
                icon={Coin}
                icon2={CoinWhite}
              />
              <ItemsTokenomics
                text="1% Treasury"
                icon={MoneyBag}
                icon2={MoneyBagWhite}
              />
            </div>
          </Viewport>
        </div>
        <div className="totalFmoneySupply">
          <TotalFmoneySupply />
        </div>
        <div className="checkWhitepaper flex ">
          <div className="flex ">
            <div className="buttonFlex flex animate__rollIn animate__delay-2s">
              <Button
                text={t("tokenomics.buttonWhitepaper")}
                iconRight={arrowUpRight}
                onPress={() => abrirLink()}
              />
            </div>
            {/*    <div className="textAddress flex  animate__rollIn  animate__delay-2s">
              {copied && <ToolTip text="Copied!" />}
              <CopyToClipboard
                text="0x00000000000000000000000000000000000DeAd"
                onCopy={() => handleCopy()}
              >
                <h5 className="pointer">
                  Contract address:
                  <span data-tip="Copied!">0x00000000...000000DeAd</span>
                </h5>
              </CopyToClipboard>

              <CopyToClipboard
                text="0x00000000000000000000000000000000000DeAd"
                onCopy={() => handleCopy()}
              >
                <img className="pointer" src={copy} alt="copy" />
              </CopyToClipboard>
              <img className="pointer" src={open} alt="open" />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenomicsScreen;
