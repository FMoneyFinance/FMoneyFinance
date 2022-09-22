import React, { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import SplashScreen from '../../components/Splash'
import MainLayout from '../../layouts/main'
import TableWelcome from '../Home/parts/graph'
import './styles.scss'
import TicketLanding from '../../assets/ilustrations/TicketLanding.svg'
import background from '../../assets/ilustrations/backgroundRafflesHystory.svg'
import borderBackground from '../../assets/ilustrations/borderBackground.svg'
import AllRights from '../../components/allRights'
import Money6 from '../../assets/ilustrations/landingpage/moneys/money6.svg'

function userHistory() {
  const params = useParams()
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

  const Moneys = () => {
    return (
      <div className="ContainerMoneysUserHistory">
        <img src={Money6} className={`Money6UserHistory`} />
      </div>
    )
  }

  return (
    <Suspense fallback={<SplashScreen />}>
      <img src={background} className="landingScreenBackground" />
      <MainLayout>
        <div className="containerRaffleHistoryScreen">
          {!isImageLoaded && <SplashScreen />}
          <>
            <div className="landingScreen userHistoryScreen">
              <img src={borderBackground} id="borderBackground" />
              <div className="outBackground">
                <TableWelcome userHistory params={params} />
              </div>
            </div>
          </>
        </div>
        <Moneys />
        <AllRights />
      </MainLayout>
    </Suspense>
  )
}

export default userHistory
