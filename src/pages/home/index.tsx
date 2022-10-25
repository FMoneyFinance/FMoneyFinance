import React, { Suspense } from 'react'
import MainLayout from '../../layouts/main'
import './styles.scss'
import TicketLanding from '../../assets/ilustrations/TicketLanding.svg'
import background from '../../assets/ilustrations/LandingBackground.svg'
import borderBackground from '../../assets/ilustrations/borderBackground.svg'

import SplashScreen from '../../components/Splash'
import AllRights from '../../components/allRights'
import WelcomeText from './parts/welcomeText'
import TableWelcome from './parts/graph'
import ThreeSimpleSteps from './parts/threeSimpleSteps'
import PartnersPart from './parts/partners'
import { isMobile } from 'react-device-detect'

function HomeScreen(props: any) {
  const [isImageLoaded, setIsImageLoaded] = React.useState(false)

  React.useEffect(() => {
    const image = new Image()
    image.onload = () => {
      setIsImageLoaded(true)
    }
    image.src = TicketLanding

    return () => {
      image.onload = null
    }
  }, [])

  return (
    <Suspense fallback={<SplashScreen />}>
      <div>
        {!isImageLoaded && <SplashScreen />}
        <>
          <img src={background} className="landingScreenBackground" />

          <div className="landingScreen">
            <MainLayout>
              <WelcomeText />
              <img src={borderBackground} id="borderBackground" />
              <div className="outBackground">
                <TableWelcome />
                <ThreeSimpleSteps />
                <PartnersPart />
                <AllRights />
              </div>
            </MainLayout>
          </div>
        </>
      </div>
    </Suspense>
  )
}

export default HomeScreen
