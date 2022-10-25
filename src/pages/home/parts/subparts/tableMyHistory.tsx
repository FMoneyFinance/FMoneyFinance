import React, { useContext, useEffect, useState, Suspense, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ConnectWallet from '../../../../components/Buttons/connectWallet'
import AppContext from '../../../../context/AppContext'
import { ThereAWallet } from '../../../../utils/wallet/index'
import { lastTimeStamp } from '../../../../utils/raffles/index'
import Win from '../../../../assets/icons/win.svg'
import LoaderComponent from '../../../../components/elements/loader'
import { timeStampToString } from '../../../../utils/formater/date'
import CountDownRaffle from '../../../../components/raffle/countdownDraw'
import BuyTicketButton from '../../../../components/Buttons/buyTicket'
import { deleteFakeRaffles } from '../../../../utils/raffles'
import { getNextDraw } from '../../../../utils/raffles'

const contextWin: any = window

function TableMyHistory({ errorGettingData, dataUserRaffles, FullHistoryClosed, loading, handleClickOpenModal }: any) {
  const context: any = useContext(AppContext)
  const { t } = useTranslation(['home'])
  const allRaffles: any = context?.state?.rafflesInfo
  const [minRaffle, setMinRaffle] = useState<any>([])

  useEffect(() => {
    const minTimeStamp = getNextDraw(context)
    const found = context?.state?.rafflesInfo?.find((data: any) => data?.timestampDateOfDraw == minTimeStamp)
    setMinRaffle(found || [])

    console.log('foundd', found)
  }, [])

  console.log('test', minRaffle)

  const RowMyHistory = (props: any) => {
    return (
      <div className="row row-my-history" onClick={() => handleClickOpenModal(props.data)}>
        <div className={`left`}>
          <h4>{props.data?.raffleName}</h4>
        </div>
        <div className="center">
          <h4>{timeStampToString(props.data?.dateOfDraw * 1000, 1)}</h4>
        </div>
        <div className="right">
          <span>{props.data?.numOfSpotTicketsBougthInRaffle}</span>
        </div>

        <div className="containerMedallaGanador">{props.data?.userWinnerInRaffle && <img src={Win} />}</div>
        <div className="right">
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.57576 1.81579L9 9.24003L1.57576 16.6643" stroke="#20311F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    )
  }

  const RowsMyHistory = () => {
    if (dataUserRaffles?.length || loading) {
      return (
        <>
          <Suspense fallback="">
            {dataUserRaffles?.map((data: any, idx: number) => (
              <RowMyHistory key={idx} data={data} />
            ))}
          </Suspense>
        </>
      )
    } else {
      return (
        <Suspense fallback="">
          <div className="containerInfoVacia">
            <h3> {t('tableWelcome.table.headerMyHistory.noRafflesText.text1')}</h3>
            <br />
            <h5> {t('tableWelcome.table.headerMyHistory.noRafflesText.text3')}</h5>
          </div>
        </Suspense>
      )
    }
  }

  const memoRowsMyHistory = useMemo(RowsMyHistory, [])

  const HeaderMyHistory = () => {
    if (FullHistoryClosed?.length > 0) {
      return (
        <Suspense fallback="">
          <div className="headerTable headerTable-my-history">
            <div>
              <h3 className="left">{t('tableWelcome.table.headerMyHistory.raffle')}</h3>
            </div>
            <div>
              <h3 className="center">{t('tableWelcome.table.headerMyHistory.date')}</h3>
            </div>
            <div>
              <h3 className="right">{t('tableWelcome.table.headerMyHistory.tickets')}</h3>
            </div>
          </div>
        </Suspense>
      )
    }

    return (
      <div className="headerTable disabled headerTable-my-history">
        <div>
          <h3 className="left">{t('tableWelcome.table.headerMyHistory.raffle')}</h3>
        </div>
        <div>
          <h3 className="center">{t('tableWelcome.table.headerMyHistory.date')}</h3>
        </div>
        <div>
          <h3 className="right">{t('tableWelcome.table.headerMyHistory.tickets')}</h3>
        </div>
      </div>
    )
  }

  /* Erro getting data */
  if (!loading && errorGettingData && ThereAWallet(context)) {
    return (
      <div className="connect-wallet-table">
        <h5>{t('tableWelcome.table.errorWarningRaffleHistory')}</h5>
        <div className="container-button-connect-wallet">
          <div onClick={() => contextWin.location.reload()} className="button button-connect-wallet hidden-undefined secondary-button-undefined rounder-true button-loading-undefined button-disabled-undefined button-outlined-undefined">
            <span>{t('tableWelcome.table.errorRaffleHistoryButtonText')}</span>
          </div>
        </div>
      </div>
    )
  }

  /* We recommend  */
  if (!loading && ThereAWallet(context) && allRaffles?.length >= 1 && dataUserRaffles?.length < 1 && minRaffle) {
    return (
      <>
        <Suspense fallback="">
          {/* <HeaderMyHistory /> */}
          {loading && <div></div>}
          <>
            <div className="containerBuyTicketNow containerInfoVacia containerMyInfoVacia flex">
              <div className="containerTextRecommend">
                <h5>{t('tableWelcome.noTicketsYet')}</h5>
                <h5>
                  <strong>{t('tableWelcome.noTicketsRecommendation')}</strong>
                </h5>
              </div>
              <br />
              <br />
              <div>
                <h4>{minRaffle?.raffleName}</h4>
                <h2>$ {minRaffle?.priceOfTheRaffleTicketInUSDC} USDC</h2>
              </div>
              <div className="dateToExpire">
                <CountDownRaffle green timestampDateOfDraw={minRaffle?.timestampDateOfDraw} />
              </div>
              <div style={{ width: '90%', maxWidth: '320px' }} className="containerButton">
                <BuyTicketButton className="buttonImgContainer" buttonProps={{ secondary: true, rounded: true }} raffleSelected={minRaffle} />
              </div>
            </div>
          </>
        </Suspense>
      </>
    )
  }

  /* no raffles exist for admins) */
  if (ThereAWallet(context) && context.state?.isAdminUser && allRaffles?.length < 1) {
    return (
      <>
        <Suspense fallback="">
          <HeaderMyHistory />
          {loading && <div></div>}
          <>
            <div className="containerInfoVacia containerMyInfoVacia">
              <h3>{t('tableWelcome.table.headerMyHistory.noRafflesText.text1')}</h3>
              <br />
              <h5>{t('tableWelcome.table.headerMyHistory.noRafflesText.text2')}</h5>
            </div>
          </>
        </Suspense>
      </>
    )
  }

  if (dataUserRaffles?.length > 0 || loading || ThereAWallet(context)) {
    return (
      <>
        <Suspense fallback="">
          <HeaderMyHistory />
          {ThereAWallet(context) ? (
            <>
              {loading ? (
                <div className="mt-7 loadingMyHistory">
                  <LoaderComponent logo small />
                  <br />
                  <h4>{t('tableWelcome.table.headerMyHistory.loading')}</h4>
                </div>
              ) : (
                memoRowsMyHistory
              )}
            </>
          ) : (
            <div className="connect-wallet-table">
              <h5>{t('tableWelcome.table.connectYourWallet')}</h5>
              <div className="container-button-connect-wallet">
                <ConnectWallet />
              </div>
            </div>
          )}
        </Suspense>
      </>
    )
  }

  return (
    <div className="connect-wallet-table">
      <h5>{t('tableWelcome.table.connectYourWallet')}</h5>
      <div className="container-button-connect-wallet">
        <ConnectWallet />
      </div>
    </div>
  )
}

export default TableMyHistory
