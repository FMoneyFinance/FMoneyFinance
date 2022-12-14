import React, { useContext, useState, useEffect } from 'react'
import Button from '../index'
import './styles.scss'
import AppContext from '../../../context/AppContext'
import walletSVG from '../../../assets/icons/wallet.svg'
import { FormatWalletAddress } from '../../../utils/formater/string'
import { useTranslation } from 'react-i18next'
import LogoutWallet from '../../LogoutWallet'
import { isMobile } from 'react-device-detect'

function ConnectWallet({ tikcketDetails }: any) {
  const { t } = useTranslation(['connectWallet'])
  const context: any = useContext(AppContext)
  const { changeContext } = context
  const [openDropOptions, setOpenDropOptions] = useState(false)

  const handleClick = () => {
    changeContext({ showModalConnectWallet: true })
  }

  const openDropOptionsDown = () => {
    setOpenDropOptions(!openDropOptions)
  }

  const walletMobile = (wallet: any) => {
    return wallet?.substring(0, 10) + '...' + wallet?.substring(11, 21)
  }

  return (
    <>
      {context.state?.walletAddress?.length > 10 ? (
        <>
          <div className={`walletAddressTxt ticketDetails-${tikcketDetails}`} onClick={openDropOptionsDown}>
            {t('title')}
            <img src={walletSVG} />
          </div>
          {openDropOptions && <LogoutWallet setOpenDropOptions={setOpenDropOptions} />}
        </>
      ) : (
        <Button text={t('buttonConnectWallet')} onPress={handleClick} rounded={true} />
      )}
    </>
  )
}

export default ConnectWallet
