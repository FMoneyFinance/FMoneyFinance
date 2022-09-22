import React, { useContext, useState, useEffect, Suspense, useMemo } from 'react'
import Money6 from '../../../assets/ilustrations/landingpage/moneys/money6.svg'
import ArrowRight from '../../../assets/icons/arrowRight.svg'
import ArrowLeft from '../../../assets/icons/arrowLeft.svg'
import RafflePoints from '../../../components/raffle/points'
import SwitchText from '../../../components/forms/switch/text'
import AppContext from '../../../context/AppContext'
import Button from '../../../components/Buttons'
import ConnectWallet from '../../../components/Buttons/connectWallet'
import ModalCreateRaffle from '../../../components/modals/createRaffle'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { user_raffles_history_api } from '../../../api/users-management'

import { getTimeToDate } from '../../../utils/maths/index'
import { ThereAWallet } from '../../../utils/wallet'
import PaginationComponent from '../../../components/pagination'
import { raffleInterface } from '../../../interfaces/raffles'
import ModalSeeMyRaffles from '../../../components/modals/seeMyRaffles'
import ModalWinnerRaffle from '../../../components/modals/WinnerOfRaffle'
import TableMyHistory from './subparts/tableMyHistory'
import '../styles.scss'

function TableWelcome({ userHistory, params }: any) {
  const [activeOptionAllHistory, setActiveOptionAllHistory] = useState(!userHistory)
  const [errorGettingData, setErrorGettingData] = useState(false)
  const [dataUserRaffles, setDataUserRaffles] = useState([])
  const [loading, setLoading] = useState(true)

  const context: any = useContext(AppContext)
  const width = window.innerWidth
  const { t } = useTranslation(['home'])
  const navigate = useNavigate()

  useEffect(() => {
    getUserRaffles()
  }, [context?.state?.walletAddress])

  useEffect(() => {
    if (context?.state?.loadUserHistory && context?.state?.loadUserHistory === true) {
      getUserRaffles()
      context.changeContext({
        loadUserHistory: false
      })
    }
  }, [context?.state?.loadUserHistory])

  const getUserRaffles = async () => {
    if (context?.state?.walletAddress?.length > 10 && context?.state?.userAccountSignature) {
      setLoading(true)
      const response: any = await user_raffles_history_api({
        defaultAccount: context.state?.walletAddress,
        userAccountSignature: context.state?.userAccountSignature
      })

      if (response.success) {
        setLoading(false)
        return setDataUserRaffles(response?.userRafflesHistory.reverse())
      }

      if (!response.success) {
        setLoading(false)
        setErrorGettingData(true)
        return setDataUserRaffles([])
      }
    }

    setLoading(false)
    return null
  }

  const handleClickCheckRaffle = (raffleSelected: raffleInterface) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    navigate(`/ticket-details-screen/${raffleSelected?.raffleSmartContractAddress}`)
  }

  const handleClickOpenModal = (raffleSelected: raffleInterface) => {
    context.changeContext({
      showModal: <ModalWinnerRaffle raffleSelected={raffleSelected} navigate={navigate} />
    })
  }

  const openModalCreateRaffle = () => {
    context.changeContext({ showModal: ModalCreateRaffleFunct })
  }

  const ModalCreateRaffleFunct = () => {
    return (
      <Suspense fallback="">
        <ModalCreateRaffle />
      </Suspense>
    )
  }

  const Moneys = () => {
    return (
      <div className="ContainerMoneys">
        <img src={Money6} className={`Money6 userHistory-${userHistory}`} />
      </div>
    )
  }

  const Table = () => {
    const nextSlider = () => {}
    const backSlider = () => {}
    const FullHistoryClosed: any = context?.state?.rafflesInfo?.filter((data: any) => data?.raffleStatus === 'closed')
    const [FullHistoryCloseHook, setFullHistoryClosed] = useState(FullHistoryClosed)
    const FullHistory = context?.state?.rafflesInfo

    const HeaderAllHistory = () => {
      if (FullHistoryClosed?.length > 0) {
        return (
          <Suspense fallback="">
            <div className="headerTable">
              <div>
                <h3 className="left">{t('tableWelcome.table.headerAllHistory.spot')}</h3>
              </div>
              <div>
                <h3 className="centerLeft">{t('tableWelcome.table.headerAllHistory.raffle')}</h3>
              </div>
              <div>
                <h3 className="centerRight">{t('tableWelcome.table.headerAllHistory.date')}</h3>
              </div>
              <div>
                <h3 className="right">{t('tableWelcome.table.headerAllHistory.price')}</h3>
              </div>
            </div>
          </Suspense>
        )
      }
      return (
        <Suspense fallback="">
          <div className="headerTable disabled">
            <div>
              <h3 className="left">{t('tableWelcome.table.headerAllHistory.spot')}</h3>
            </div>
            <div>
              <h3 className="centerLeft">{t('tableWelcome.table.headerAllHistory.raffle')}</h3>
            </div>
            <div>
              <h3 className="centerRight">{t('tableWelcome.table.headerAllHistory.date')}</h3>
            </div>
            <div>
              <h3 className="right">{t('tableWelcome.table.headerAllHistory.price')}</h3>
            </div>
          </div>
        </Suspense>
      )
    }

    const RowFullHistory = () => {
      if (FullHistoryClosed?.length > 0) {
        return FullHistoryCloseHook?.map((data: any, idx: number) => (
          <Suspense key={idx} fallback="">
            <div className="row" onClick={() => handleClickCheckRaffle(data)} key={idx}>
              <div className={`left active-true`}>
                <RafflePoints number={data?.raffleWinnerSpotPosition} />
              </div>
              <div className="centerLeft">
                <h4>{data?.raffleWinnerPlayer?.substring(0, 18) + '...'}</h4>
              </div>

              <div className="centerRight">
                <span>{dayjs.unix(data?.timestampDateOfDraw).format('MMMM DD, YYYY.')}</span>
              </div>
              <div className="right">
                <span>{`$ ${data?.prizeWonByWinner} USDC`} </span>
              </div>
            </div>
          </Suspense>
        ))
      }

      if (FullHistory?.length == 0) {
        return (
          <Suspense fallback="">
            <div className="containerInfoVacia">
              <h3>{t('tableWelcome.table.headerMyHistory.noRafflesText.text1')}</h3>
              <br />
              {ThereAWallet(context) && context.state?.isAdminUser ? <h5>{t('tableWelcome.table.headerMyHistory.noRafflesText.text2')}</h5> : <h5>{t('tableWelcome.table.headerAllHistory.noRafflesText.text2')}</h5>}
              <div className="containerButtonCreateRaffle">{ThereAWallet(context) && context.state?.isAdminUser && <Button outlined onPress={openModalCreateRaffle} text={t('buttonCreateNewRaffle')} className="create-new-raffle" />}</div>
            </div>
          </Suspense>
        )
      }
      return (
        <Suspense fallback="">
          <div className="containerInfoVacia">
            <h3>{t('tableWelcome.table.headerAllHistory.noRafflesText.text1')}</h3>
            <br />
            <h5>{t('tableWelcome.table.headerAllHistory.noRafflesText.text2')}</h5>
          </div>
        </Suspense>
      )
    }

    return (
      <div className={`table scroll-${(loading && !activeOptionAllHistory) || (dataUserRaffles.length < 1 && !activeOptionAllHistory) || (!FullHistory?.length && activeOptionAllHistory) || FullHistory?.length == 0}`}>
        {activeOptionAllHistory ? (
          <>
            <HeaderAllHistory />
            <RowFullHistory />
          </>
        ) : (
          <>
            <Suspense fallback="">
              <TableMyHistory
                {...{
                  loading,
                  dataUserRaffles,
                  errorGettingData,
                  FullHistoryClosed,
                  handleClickOpenModal
                }}
              />
            </Suspense>
          </>
        )}

        {activeOptionAllHistory ? (
          <>
            <PaginationComponent array={FullHistoryClosed} setArray={setFullHistoryClosed} perPage={10} />
          </>
        ) : (
          <>
            <PaginationComponent array={dataUserRaffles} setArray={setDataUserRaffles} perPage={10} />
          </>
        )}
      </div>
    )
  }

  const renderTable = () => {
    return (
      <Suspense fallback="">
        <div className="graphContainer">
          <h2>{params && params.walletAddress ? t('tableWelcome.titleSection') : t('tableWelcome.title')}</h2>
          <h4>{params && params.walletAddress ? t('tableWelcome.textSection') : t('tableWelcome.text')}</h4>
          {!userHistory && <SwitchText label1={t('tableWelcome.switches.allHistory')} label2={t('tableWelcome.switches.yourHistory')} active={activeOptionAllHistory} setActive={() => setActiveOptionAllHistory(!activeOptionAllHistory)} />}
          <div className="graph" style={{ width: width * 0.6 }}>
            <Table />
          </div>
          <Moneys />
        </div>
      </Suspense>
    )
  }

  const memoRenderTable = useMemo(renderTable, [SwitchText, Moneys, SwitchText])

  return <>{memoRenderTable}</>
}

export default TableWelcome
