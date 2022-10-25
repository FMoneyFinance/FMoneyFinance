import React from 'react'
import Twitch from '../../../assets/icons/twitch.svg'
import Telegram from '../../../assets/icons/telegram.svg'
import Twitter from '../../../assets/icons/twitter.svg'
import Tiktok from '../../../assets/icons/tiktok.svg'

import './index.scss'

function SocialMediaList() {
  const Item = ({ icon, link }: any) => {
    return (
      <div>
        <a href={link} target="_blank">
          <img src={icon} />
        </a>
      </div>
    )
  }
  return (
    <div className="containerIconsSocialMedia">
      <Item icon={Telegram} link={'https://t.me/FmoneyFinance'} />
      <Item icon={Twitter} link={'https://twitter.com/FmoneyFinance'} />
      <Item icon={Twitch} link={'https://twitch.tv/fmoneyfinance/'} />
      <Item icon={Tiktok} link={'https://www.tiktok.com/@fmoneyfinance'} />
    </div>
  )
}

export default SocialMediaList
