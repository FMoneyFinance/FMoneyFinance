import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SocialMediaList from "../../../../components/socialMedia/socialMediaList";
import BoxYoutube from "../../../../assets/ilustrations/newComingSoon/boxYoutube.svg";
import TrazoBackground from "../../../../assets/ilustrations/trazoBackground.svg";
import TrazoBackgroundMobile from "../../../../assets/ilustrations/trazoBackgroundMobile.svg";
import coin1 from "../../../../assets/ilustrations/moneys/Group1.svg";
import coin2 from "../../../../assets/ilustrations/moneys/Group2.svg";
import coin3 from "../../../../assets/ilustrations/moneys/Group3.svg";
import TapWatch from "../../../../assets/icons/tapWatch.svg";
import VideoComingSoon from "../../../../assets/videos/Fmoney-coming-soon.mp4";
import ReactPlayer from "react-player";
import Button from "../../../../components/Buttons";
import {
  BrowserView,
  MobileView,
  isMobile,
  TabletView
} from "react-device-detect";

function PrincipalInfo() {
  const [video, setVideo] = useState(false);
  const { t } = useTranslation();

  const handleWatchVideo = () => {
    setVideo(!video);
  };

  return (
    <div>
      <div className="containerPrincipalInfo">
        <div className="containerText">
          <h1>
            {isMobile ? t("comingSoon.titleMobile") : t("comingSoon.title")}
            <br />
          </h1>
          <br />
          <h5>
            {t("comingSoon.text")}
            <span>{t("comingSoon.text2")}</span>
          </h5>
          <br />
          <div className="containerSocialMedia flex">
            <h5 className="followus">{t("comingSoon.textSocialMedia")}</h5>
            <BrowserView>
              <SocialMediaList />
            </BrowserView>
            <TabletView>
              <SocialMediaList />
            </TabletView>
          </div>
        </div>
        <BrowserView>
          <div className={"containerVideoYoutube"}>
            <div id="videoYoutube">
              <ReactPlayer
                url={VideoComingSoon}
                width="45%"
                height="45%"
                style={{ borderRadius: "25px", margin: "auto" }}
                controls
                playing={true}
                muted={true}
                loop={true}
              />
            </div>

            <div className="containerCoins">
              <img src={coin1} alt="coin1" className="coin1" />
              <img src={coin2} alt="coin2" className="coin2" />
              <img src={coin3} alt="coin3" className="coin3" />
            </div>
          </div>
        </BrowserView>
        <TabletView>
          <div className={"containerVideoYoutube"}>
            <div id="videoYoutube">
              <ReactPlayer
                url={VideoComingSoon}
                width="45%"
                height="45%"
                style={{ borderRadius: "25px", margin: "auto" }}
                controls
                playing={true}
                muted={true}
                loop={true}
              />
            </div>

            <div className="containerCoins">
              <img src={coin1} alt="coin1" className="coin1" />
              <img src={coin2} alt="coin2" className="coin2" />
              <img src={coin3} alt="coin3" className="coin3" />
            </div>
          </div>
        </TabletView>

        <MobileView>
          <div className="containerTapWatch flex">
            {video ? (
              <Button
                iconLeft={TapWatch}
                text="Close video"
                onPress={() => handleWatchVideo()}
                className="buttonClose"
              />
            ) : (
              <Button
                text="Tap to watch demo"
                iconLeft={TapWatch}
                onPress={() => handleWatchVideo()}
              />
            )}
            {video && (
              <div id="videoYoutubeMobile">
                <ReactPlayer
                  url={VideoComingSoon}
                  width="100%"
                  height="100%"
                  style={{ borderRadius: "25px", margin: "auto" }}
                  controls
                  playing
                  volume={0.3}
                  loop={true}
                />
              </div>
            )}
          </div>
        </MobileView>
        <div className="flex">
          <img
            src={isMobile ? TrazoBackgroundMobile : TrazoBackground}
            alt="TrazoBackground"
            id="TrazoBackground"
            className={video ? "hidden" : "TrazoBackground"}
          />
        </div>
      </div>
    </div>
  );
}

export default PrincipalInfo;
