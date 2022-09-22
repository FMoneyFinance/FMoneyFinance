import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function LoaderCountdown() {
  const { t } = useTranslation(['modalBuyTicket'])
  const [showCountdown, setShowCountdown] = useState(true)
  const [loadingCountGlobal, setLoadingCountGlobal] = useState(90)
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false)
  const [loadingCountInterval, setLoadingCountInterval] = useState<any>()

  useEffect(() => {
    let loadingCount = 90
    const loadingCountIntervalId = setInterval(() => {
      setLoadingCountGlobal(loadingCount--)
    }, 1000)
    setLoadingCountInterval(loadingCountIntervalId)

    return () => {
      clearInterval(loadingCountInterval)
    }
  }, [])

  useEffect(() => {
    if (loadingCountGlobal <= 0) {
      setShowCountdown(false)
      setShowTimeoutWarning(true)
      setLoadingCountInterval(null)
      clearInterval(loadingCountInterval)
    }
  }, [loadingCountGlobal])

  return (
    <>
      {!showTimeoutWarning && showCountdown && <span style={{ fontSize: '13px' }}>{`${t('modalBuyTicket.buyingTickets.noTakeMore.text1')} ${loadingCountGlobal} ${t('modalBuyTicket.buyingTickets.noTakeMore.text2')}`}</span>}
      {showTimeoutWarning && !showCountdown && (
        <span style={{ fontSize: '13px' }}>
          {`${t('modalBuyTicket.buyingTickets.timeoutWarning.text1')}`} <br /> {`${t('modalBuyTicket.buyingTickets.timeoutWarning.text2')}`}
        </span>
      )}
    </>
  )
}

export default LoaderCountdown
