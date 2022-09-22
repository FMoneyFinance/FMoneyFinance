import React, { Suspense, useContext, useEffect, useState } from 'react'
import SplashScreen from '../../components/Splash'
import MainLayout from '../../layouts/main'
import TableWelcome from '../Home/parts/graph'
import './styles.scss'
import TicketLanding from '../../assets/ilustrations/TicketLanding.svg'
import background from '../../assets/ilustrations/backgroundRafflesHystory.svg'
import borderBackground from '../../assets/ilustrations/borderBackground.svg'
import AllRights from '../../components/allRights'
import Money6 from '../../assets/ilustrations/landingpage/moneys/money6.svg'
import NewAddress from './parts/newAddress'
import AdminList from './parts/adminList'
import AppContext from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { ThereAWallet } from '../../utils/wallet'
import { useTranslation } from 'react-i18next'
import AlertToast from '../../components/Alerts'

function adminTools() {
  const { t } = useTranslation(['adminTools'])
  const context: any = useContext(AppContext)
  const navigate = useNavigate()
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  useEffect(() => {
    console.log(context.state)

    const image = new Image()
    image.onload = () => {
      setIsImageLoaded(true)
    }
    image.src = TicketLanding

    return () => {
      image.onload = null
    }
  }, [])

  useEffect(() => {
    if (!context?.state?.isAdminUser || !ThereAWallet(context)) {
      navigate('/')
    }
  }, [context])

  return (
    <Suspense fallback={<SplashScreen />}>
      <MainLayout>
        <Suspense fallback={<SplashScreen />}>
          <div className="containerAdminTools">
            <div className="Container">
              {!isImageLoaded && <SplashScreen />}
              <div className="Titles">
                <h1>{t('title')}</h1>
                <h5>{t('subTitle')}</h5>
              </div>
              <div className="adminToolsScreen">
                <NewAddress />
                <AdminList />
              </div>
            </div>
          </div>
          <AllRights />
        </Suspense>
      </MainLayout>
    </Suspense>
  )
}

export default adminTools
