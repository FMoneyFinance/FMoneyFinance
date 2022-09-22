import React from "react";
import MainLayout from "../../layouts/main";
import "./styles.scss";
import TicketLanding from "../../assets/ilustrations/TicketLanding.svg";
import background from "../../assets/ilustrations/LandingBackground.svg";
import middlemoon from "../../assets/ilustrations/middlemoon.svg";
import SplashScreen from "../../components/Splash";
import AllRights from "../../components/allRights";
import WelcomeText from "./parts/welcomeText";
import MiniPools from "./parts/minipools";
import GraphWelcome from "./parts/graph";
import ThreeSimpleSteps from "./parts/threeSimpleSteps";
import PartnersPart from "./parts/partners";

function HomeScreen(props: any) {
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);

  React.useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setIsImageLoaded(true);
    };
    image.src = TicketLanding;

    return () => {
      image.onload = null;
    };
  }, []);

  return (
    <div>
      {!isImageLoaded && <SplashScreen />}
      <>
        <img src={background} className="landingScreenBackground" />
        <img src={middlemoon} className="landingScreenBackgroundMiddleMoon" />

        <div className="landingScreen">
          <MainLayout>
            <WelcomeText />
            <div className="outBackground">
              <MiniPools {...props} />
              <GraphWelcome />
              <ThreeSimpleSteps />
              <PartnersPart />
              <AllRights />
            </div>
          </MainLayout>
        </div>
      </>
    </div>
  );
}

export default HomeScreen;
