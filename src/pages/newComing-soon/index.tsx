import React from "react";
import AllRights from "../../components/allRights";
import MainLayout from "../../layouts/main";
import ComunityScreen from "./parts/Comunity";
import DeveloperScreen from "./parts/Developers";
import PrincipalInfo from "./parts/principalInfo";
import TokenomicsScreen from "./parts/tokenomics";

import "./style.scss";

function ComingSoon() {
  return (
    <div>
      <MainLayout>
        <div className="containerNewComingSoon">
          <PrincipalInfo />
          <div className="BackgroundTwo">
            <TokenomicsScreen />
            <DeveloperScreen />
            <ComunityScreen />
          </div>
          <AllRights />
        </div>
      </MainLayout>
    </div>
  );
}

export default ComingSoon;
