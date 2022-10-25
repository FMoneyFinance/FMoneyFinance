import React, { useState } from 'react'
import MainLayout from '../../layouts/main/index'
import background from '../../assets/ilustrations/comingsoon/Background.png'
import backgroundMobile from '../../assets/ilustrations/trazoBackgroundMobile.webp'
import phone from '../../assets/ilustrations/comingsoon/Phone.png'
import './index.scss'
import Countdown from 'react-countdown'
import SocialMediaList from '../../components/socialMedia/socialMediaList/index'
import Star1 from '../../assets/ilustrations/comingsoon/Moneda 1.svg'
import Star2 from '../../assets/ilustrations/comingsoon/Moneda 2.svg'
import Star3 from '../../assets/ilustrations/comingsoon/Moneda 3.svg'
import Star4 from '../../assets/ilustrations/comingsoon/Moneda 4.svg'
import Star5 from '../../assets/ilustrations/comingsoon/Moneda 5.svg'
import AllRights from '../../components/allRights'
import Lottie from 'lottie-react'
import { getAnimation } from '../../assets/animations/phoneAndMoneys/data'

function ComingSoonScreen() {
  const animation = getAnimation()

  const renderer: any = ({ hours, minutes, seconds, completed }: any) => {
    return (
      <div className="containerItemNextDraw">
        <ItemNextDraw number={hours > 10 ? hours : '0' + hours.toString()} />
        <span>:</span>
        <ItemNextDraw number={minutes > 10 ? minutes : '0' + minutes.toString()} />
        <span>:</span>
        <ItemNextDraw number={seconds < 10 ? '0' + seconds : seconds} />
      </div>
    )
  }

  const ItemNextDraw = ({ number }: any) => {
    return <div>{number}</div>
  }

  const MoneysContainer = () => {
    return (
      <div className="starsContainer">
        <img src={Star1} className="star1" />
        <img src={Star2} className="star2" />
        <img src={Star3} className="star3" />
        <img src={Star4} className="star4" />
        <img src={Star1} className="star5" />
      </div>
    )
  }

  const onCompleteAnimation = () => {}

  return (
    <div>
      <img src={background} className="landingScreenBackground landingScreenBackgroundComingSoon" />
      <img src={backgroundMobile} className="landingScreenBackgroundMobile" />
      <div className="containerComingSoon">
        <MainLayout hideConnect>
          <div className="fullheight">
            <Lottie loop={false} onLoopComplete={() => {}} onComplete={onCompleteAnimation} animationData={animation} className="lottie" />
            <MoneysContainer />
            <div className="welcomeText">
              <div className="containerImg">{/* <img src={phone} /> */}</div>
              <div className="containerText">
                <h4>BE THE NEXT WINNER</h4>
                <h1>
                  Coming soon! <br /> The f•money raffle!
                </h1>
                <h5>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</h5>
                <Countdown date={Date.now() + 5000000} renderer={renderer} />
                <h5 className="followus">Follow us to find out the latest news.</h5>
                <SocialMediaList />
              </div>
            </div>
          </div>
        </MainLayout>
        <AllRights />
      </div>
    </div>
  )
}

export default ComingSoonScreen
