import React, { useState, useContext, useMemo, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import JSConfetti from 'js-confetti'

import { useTranslation } from 'react-i18next'
import { isDesktop } from 'react-device-detect'
import Popper from '../../../../../components/Popper'
import AppContext from '../../../../../context/AppContext'
import { ThereAWallet } from '../../../../../utils/wallet'
import Copy from '../../../../../assets/icons/copyWhite.svg'
import Open from '../../../../../assets/icons/openWhite.svg'
import { sameWalletAddress } from '../../../../../utils/validators'
import lampIcon from '../../../../../assets/icons/ticketDetails/lampIcon.svg'
import userIcon from '../../../../../assets/icons/ticketDetails/userIcon.svg'
import swipeIcon from '../../../../../assets/icons/ticketDetails/swipeIcon.svg'
import Coin from '../../../../../assets/ilustrations/ticketsDetails/Moneda.webp'
import Coin2 from '../../../../../assets/ilustrations/ticketsDetails/Moneda2.svg'
import userIconGray from '../../../../../assets/icons/ticketDetails/userIconGray.svg'
import lampIconGray from '../../../../../assets/icons/ticketDetails/lampIconGray.svg'
import swipeIconGray from '../../../../../assets/icons/ticketDetails/swipeIconGray.svg'

export default function GraphLinesClosed({ raffleSelected }: any) {
  const context: any = useContext(AppContext)
  const { t } = useTranslation(['ticket-details'])
  const [winner, setWinner] = useState(sameWalletAddress(context?.state?.walletAddress, raffleSelected?.raffleWinnerPlayer))

  useEffect(() => {
    setWinner(sameWalletAddress(context?.state?.walletAddress, raffleSelected?.raffleWinnerPlayer))
  }, [context?.state?.walletAddress])

  const confettiDisplay = () => {
    if (winner) {
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti()
    }
  }

  const memoConffetiDisplay = useMemo(confettiDisplay, [])

  const handleClick = () => {
    context.changeContext({ showModalConnectWallet: true })
  }

  const WinnerSpots = ({ num }: any) => {
    return (
      <div className="winnerSport">
        <h3>{num}</h3>
      </div>
    )
  }

  const Item = ({ urlPrefix, applyStyle, icon, title, address }: any) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
      setCopied(true)
      timeOut
    }
    const timeOut = setTimeout(() => {
      setCopied(false)
    }, 3500)

    return (
      <>
        <div className="containerSectionGraph" style={applyStyle ? applyStyle : { boxSizing: 'border-box', position: 'relative' }}>
          <div className="containerIMGGraph">
            <img style={{ width: '100%', maxWidth: '60px' }} src={icon} alt="icon" />
          </div>
          {copied && <Popper text={t('popper.text')} />}
          <div className="containerTexts textEllipsis">
            <h2>{title}</h2>
            <h5>
              {/* copied && <Popper text={t('popper.text')} /> */}
              <CopyToClipboard text={address} onCopy={handleCopy}>
                <span className={!ThereAWallet(context) || (ThereAWallet(context) && !winner) ? 'start pointer textEllipsis noWinner-true' : 'start pointer textEllipsis noWinner-false'}>{address}</span>
              </CopyToClipboard>
              &nbsp; &nbsp; &nbsp;
              <div>
                <CopyToClipboard text={address} onCopy={handleCopy}>
                  <img src={Copy} className="pointer textEllipsis" />
                </CopyToClipboard>
                &nbsp; &nbsp;
                <a href={`${import.meta.env.VITE_ETHERSCAN_PREFIX}${urlPrefix}${address}`} target="_blank" rel="noopener noreferrer">
                  <img src={Open} className="pointer textEllipsis" />
                </a>
              </div>
            </h5>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {isDesktop && <img src={Coin} alt="Coin" id="CoinGraphLineClosed" />}
      {winner && isDesktop && <img src={Coin2} alt="Coin" id="CoinGraphLineClosed2" />}
      <div className={winner ? 'containerGraphLines Closed Winner' : 'containerGraphLines Closed'}>
        <Item urlPrefix="address/" applyStyle={{ boxSizing: 'border-box', paddingTop: '8%', position: 'relative' }} icon={!ThereAWallet(context) || (ThereAWallet(context) && !winner) ? userIconGray : userIcon} title={t('closedRaffle.raffleWinnerAddress')} address={raffleSelected?.raffleWinnerPlayer} />
        <Item urlPrefix="tx/" icon={!ThereAWallet(context) || (ThereAWallet(context) && !winner) ? swipeIconGray : swipeIcon} title={t('closedRaffle.txHashPrize')} address={raffleSelected?.raffleTxHashOfSetWinner} />
        <Item urlPrefix="tx/" icon={!ThereAWallet(context) || (ThereAWallet(context) && !winner) ? lampIconGray : lampIcon} title={t('closedRaffle.txHashDraw')} address={raffleSelected?.raffleTxHashOfDraw} />
        <div className="containerInfoWinner textEllipsis">
          <div>
            <h2>{t('closedRaffle.winnerSpotPosition')}</h2>
            <h5 className={!ThereAWallet(context) || (ThereAWallet(context) && !winner) ? 'noWinner-true' : 'noWinner-false'}>
              <span>{raffleSelected?.raffleWinnerSpotPosition}</span>
            </h5>
          </div>
          <div>
            <div>
              <h2>{t('closedRaffle.prizeWon')}</h2>
              <h5 className={!ThereAWallet(context) || (ThereAWallet(context) && !winner) ? 'noWinner-true' : 'noWinner-false'}>
                <span>{`${raffleSelected?.prizeWonByWinner} USDC`}</span>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
