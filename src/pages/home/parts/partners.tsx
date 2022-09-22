import React from "react";
import SocialMediaList from "../../../components/socialMedia/socialMediaList";

function PartnersPart() {
  const Item = () => {
    return <div className="containerItem"></div>;
  };

  return (
    <div className="PartnersPart">
      <h4>PARTNERS</h4>
      <h2>Sed ut perspiciatis unde omnis iste natus error sit volupt</h2>
      <div className="containerItems">
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
      </div>

      <div className="flex">
        <SocialMediaList />
      </div>
    </div>
  );
}

export default PartnersPart;
