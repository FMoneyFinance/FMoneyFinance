import React from "react";

import Telegram from "../../../assets/icons/telegram.svg";
import Twitter from "../../../assets/icons/twitter.svg";
import Tiktok from "../../../assets/icons/tiktok.svg";
import Twitch from "../../../assets/icons/twitch.svg";
import "./index.scss";

function SocialMediaList() {
  const Item = ({ icon, link }: any) => {
    return (
      <div>
        <a href={link && link} target={link && "_blank"}>
          <img src={icon} />
        </a>
      </div>
    );
  };
  return (
    <div className="containerIconsSocialMedia">
      <Item icon={Twitter} link={"https://twitter.com/FmoneyFinance"} />
      <Item icon={Twitch} link={"https://www.twitch.tv/fmoneyfinance/"} />
      <Item icon={Telegram} link={"https://t.me/+UxKXintqJZc4NTUx"} />
      <Item icon={Tiktok} link={"https://www.tiktok.com/@fmoneyfinance"} />
    </div>
  );
}

export default SocialMediaList;
