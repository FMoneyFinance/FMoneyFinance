import React, { Suspense, useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import { Contract } from 'ethers'
import axios from 'axios'

import Button from '../../Buttons'
import FullModal from '../base/full'
import RafflePoints from '../../raffle/points'
import ButtonsArrow from '../../Buttons/arrows'
import ModalBuyTicket from '../buyTicket/index'
import AppContext from '../../../context/AppContext'
import { spotInterface } from '../../../interfaces/spot'
import LoaderComponent from '../../elements/loader/index'
import { raffleInterface } from '../../../interfaces/raffles'
import { timeStampToString } from '../../../utils/formater/date'
import { download_tickets } from '../../../api/tickets-management/index'
import { payloads_users_management } from '../../../api/users-management/dtos'
import ticketOff from '../../../assets/ilustrations/landingpage/ticketOff.svg'
import { handleGetAvailableSpots } from '../../../web3/functions/ticket & spots'
import { user_raffle_position_slots_api } from '../../../api/users-management/index'
import { getProvider, getWalletConnectProvider } from '../../../web3/functions/providers'
import fmoneyRaffleOperatorContract from '../../../web3/contracts/interfaces/IFmoneyRaffleOperator.json'

const contextWin: any = window

function ModalSeeMyRaffles({ raffleSelected }: { raffleSelected: raffleInterface }) {
  const [skip, setSkip] = useState(0)
  const [error, setError] = useState('')
  const [limit, setlimit] = useState(15)
  const [spots, setspots] = useState([])
  const [loading, setLoading] = useState(true)
  const [availabeSpots, setAvailabeSpots] = useState([])
  const [spotsToShowInPage, setSpotsToShowInPage] = useState([])
  const [spotsOfUser, setSpotsOfUser] = useState<Array<spotInterface>>([])

  const context: any = useContext(AppContext)
  const { t } = useTranslation(['modalSeeMyRaffles'])

  useEffect(() => {
    getTheSpots()
  }, [])

  useEffect(() => {
    paginationSlice(spotsOfUser)
  }, [spotsOfUser, skip])

  const getTheSpots = async () => {
    const payload: any = {
      defaultAccount: context.state?.walletAddress,
      userAccountSignature: context.state?.userAccountSignature,
      raffleSmartContractAddress: raffleSelected?.raffleSmartContractAddress
    }
    const response: any = await user_raffle_position_slots_api(payload)

    setLoading(false)

    if (response.success) {
      setSpotsOfUser(response?.spotTicketsBougthInRaffle)
    }
  }

  const getraffleSpots = async () => {
    setLoading(true)
    const { success, spots: spotList }: any = await handleGetAvailableSpots(raffleSelected?.raffleSmartContractAddress)

    setLoading(false)
    if (success) {
      await context.changeContext({ spotList: [...spotList] })
      setAvailabeSpots(spotList)

      return spotList
    }
  }

  const handleDownloadCurrentSpots = async () => {
    setLoading(true)
    const tokenURIOfTickets: Array<string> = []
    let ownerOfAllTickets = true
    const ticketMetadataRegisteredJsons = []
    const ticketMetadataRegisteredIpfsHashes = []
    const provider = contextWin.ethereum ? getProvider() : await getWalletConnectProvider()
    const fmoneyRaffleOperatorContractInstance = new Contract(raffleSelected?.raffleSmartContractAddress, fmoneyRaffleOperatorContract.abi, provider)

    for (let i = 0; i < spotsOfUser.length; i++) {
      const ownerOfTicket = await fmoneyRaffleOperatorContractInstance.ownerOf(spotsOfUser[i])
      const tokenURIOfTicket = await fmoneyRaffleOperatorContractInstance.tokenURI(spotsOfUser[i])

      if (String(ownerOfTicket).toLowerCase() !== String(context.state?.walletAddress).toLowerCase()) {
        ownerOfAllTickets = false
        break
      } else {
        tokenURIOfTickets.push(tokenURIOfTicket)
      }
    }

    if (!ownerOfAllTickets) {
      setError(t('errorOwnership'))
      setLoading(false)
      return
    }

    for (let i = 0; i < tokenURIOfTickets.length; i++) {
      const ticketTokenURIJson = await axios.get(tokenURIOfTickets[i])
      ticketMetadataRegisteredJsons.push(ticketTokenURIJson.data)
      ticketMetadataRegisteredIpfsHashes.push(tokenURIOfTickets[i].split('/')[4])
    }

    const payload: object = {
      ticketMetadataRegisteredJsons,
      ticketMetadataRegisteredIpfsHashes
    }

    const response: any = await download_tickets(payload, context)
    setLoading(false)
    window.open(response.location, '_blank')
  }

  const handleClick = () => {
    context.changeContext(
      {
        showModal: (
          <Suspense fallback="">
            <ModalBuyTicket
              {...{
                listSpotsToBuy: spots,
                getraffleSpots,
                onCloseModal: () => {},
                raffleSelected,
                allSpots: availabeSpots
              }}
            />
          </Suspense>
        )
      },
      true
    )
  }

  const paginationSlice = (spotsOfUser: any) => {
    if (!Array.isArray(spotsOfUser)) setSpotsToShowInPage([])
    if (skip == 0 && limit == 0) setSpotsToShowInPage([])

    const spotsToDisplayUpdated = spotsOfUser.slice(skip, skip + limit)
    setSpotsToShowInPage(spotsToDisplayUpdated)
  }

  const configModalSeeMyRaffles = {
    title: `${t('title')}`,
    onPressButton: handleClick,
    classButton: 'buttonYourRafflesSpots',
    config: {
      hideElements: loading
    },
    setShowModal: () => {
      context.changeContext({ showModal: null })
    },
    offset: {
      top: '3.7vh',
      right: '12vw'
    },
    styles: {
      minWidth: isMobile ? '90%' : '28vw'
    }
  }

  return (
    <FullModal
      showModal={true}
      config={{
        hideButton: loading,
        ...configModalSeeMyRaffles,
        minWidth: isMobile && '90%',
        buttonTxt: spotsOfUser?.length == 0 ? `${t('buyOneNow')}` : `${t('buyMoreNow')}`
      }}
    >
      {loading ? (
        <div className="mt-10" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', width: '90%', marginBottom: '10%' }}>
          <LoaderComponent logo />
          <div style={{ marginTop: '15px', color: '#3c6132' }}>{t('loading')}</div>
        </div>
      ) : (
        <>
          <div className="ContainerAllSpots">
            {spotsToShowInPage.length > 0 ? (
              <div className={`containerRafflePointsModal grid-${spotsOfUser?.length ? true : false}`}>
                {spotsToShowInPage.map((spot: number) => {
                  return (
                    <div>
                      <RafflePoints active number={spot} />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="empty-spots-purchased">{`${t('dontHave')}`}</div>
            )}
            <div className="grid-points-buttons" style={{ marginTop: '20px', display: 'flex' }}>
              <div className={skip == 0 ? `hidden left` : 'left'} style={spotsOfUser.length <= 15 ? { display: 'none', marginRight: '8px' } : { marginRight: '8px' }}>
                <ButtonsArrow
                  onPress={() => {
                    if (skip != 0) {
                      setSkip(skip - 15)
                    }
                  }}
                />
              </div>
              <div className={skip + 15 >= spotsOfUser.length ? 'hidden' : ''} style={spotsOfUser.length <= 15 ? { display: 'none', marginLeft: '8px' } : { marginLeft: '8px' }}>
                <ButtonsArrow
                  right
                  onPress={() => {
                    if (skip + 15 < spotsOfUser.length) {
                      setSkip(skip + 15)
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <h3 className="titleRafflePointsModal">
            <span>{`${t('draw')}`}</span> {timeStampToString(raffleSelected?.timestampDateOfDraw * 1000, 1)}
          </h3>
          {spotsOfUser?.length == 0 && <img className="imgEmptyList" src={ticketOff} />}
          {error && (
            <div className="flex">
              <div className="containerErrorInputs flex">
                <h5 className="error-input">{error}</h5>
              </div>
            </div>
          )}
          {spotsOfUser?.length > 0 && (
            <div className="ModalInfo_ContainerButton" style={{ position: 'relative', left: '0px', right: '0px', width: '90%', bottom: '0px', marginTop: '0px' }}>
              <Button applyStyle={{ padding: '20px', boxSizing: 'border-box', marginBottom: '20px' }} hidden={loading} text={`${t('buttonText')}`} onPress={() => handleDownloadCurrentSpots()} />
            </div>
          )}
        </>
      )}
    </FullModal>
  )
}

export default ModalSeeMyRaffles
