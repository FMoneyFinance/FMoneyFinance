import React, { useState, Suspense } from "react";
import MainLayout from "../../layouts/main/index";
import background from "../../assets/ilustrations/comingsoon/Background.png";
import backgroundMobile from "../../assets/ilustrations/trazoBackgroundMobile.png";
import phone from "../../assets/ilustrations/comingsoon/Phone.png";
import "./index.scss";
/* import Countdown from "react-countdown"; */
import SocialMediaList from "../../components/socialMedia/socialMediaList/index";
import Star1 from "../../assets/ilustrations/comingsoon/img_1.png";
import Star2 from "../../assets/ilustrations/comingsoon/img_2.png";
import Star3 from "../../assets/ilustrations/comingsoon/img_3.png";
import Star4 from "../../assets/ilustrations/comingsoon/img_4.png";
import Star5 from "../../assets/ilustrations/comingsoon/img_5.png";
import Star6 from "../../assets/ilustrations/comingsoon/img_0.png";

/* import Star5 from "../../assets/ilustrations/comingsoon/Moneda 5.svg"; */
import AllRights from "../../components/allRights";
import Lottie from "lottie-react";
import { getAnimation } from "../../assets/animations/phoneAndMoneys/data";

import { useTranslation } from "react-i18next";

function ComingSoonScreen() {
  const animation = getAnimation();
  const { t } = useTranslation();

  const renderer: any = ({ hours, minutes, seconds, completed }: any) => {
    return (
      <div className="containerItemNextDraw">
        <ItemNextDraw number={hours > 10 ? hours : "0" + hours.toString()} />
        <span>:</span>
        <ItemNextDraw
          number={minutes > 10 ? minutes : "0" + minutes.toString()}
        />
        <span>:</span>
        <ItemNextDraw number={seconds < 10 ? "0" + seconds : seconds} />
      </div>
    );
  };

  const ItemNextDraw = ({ number }: any) => {
    return <div>{number}</div>;
  };

  const MoneysContainer = () => {
    return (
      <div className="starsContainer">
        <img src={Star1} className="star1" />
        <img src={Star2} className="star2" />
        <img src={Star3} className="star3" />
        <img src={Star4} className="star4" />
        <img src={Star6} className="star5" />
        <img src={Star6} className="star1 star6" />
      </div>
    );
  };

  const onCompleteAnimation = () => {};

  return (
    <Suspense fallback="">
      <div>
        <img
          src={background}
          className="landingScreenBackground landingScreenBackgroundComingSoon"
        />
        <img src={backgroundMobile} className="landingScreenBackgroundMobile" />
        <div className="containerComingSoon">
          <MainLayout hideConnect>
            <div className="fullheight">
              <Lottie
                loop={false}
                onLoopComplete={() => {}}
                onComplete={onCompleteAnimation}
                animationData={animation}
                className="lottie"
              />
              <MoneysContainer />

              <div className="welcomeText flex">
                <div className="containerImg">{/* <img src={phone} /> */}</div>
                <div className="containerText">
                  <h4>{t("comingSoon.subTitle")}</h4>

                  <h1>
                    {t("comingSoon.title")}
                    <br />
                  </h1>
                  <br />
                  <h5>{t("comingSoon.text")} <b>{t("comingSoon.text2")}</b></h5>

                  <div className="containerSocialMedia flex">
                    <h5 className="followus">
                      {t("comingSoon.textSocialMedia")}
                    </h5>
                    <SocialMediaList />
                  </div>
                </div>
              </div>
            </div>
          </MainLayout>
          <AllRights />
        </div>
      </div>
    </Suspense>
  );
}

export default ComingSoonScreen;
