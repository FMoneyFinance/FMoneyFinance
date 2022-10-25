import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppContext from '../../../context/AppContext'
import RafflePoints from '../../raffle/points'
import Win from '../../../assets/icons/win.svg'
import FullModal from '../base/full'
import { user_raffle_position_slots_api } from '../../../api/users-management/index'
import { payloads_users_management } from '../../../api/users-management/dtos'
import { raffleInterface } from '../../../interfaces/raffles'
import LoaderComponent from '../../elements/loader/index'
import { spotInterface } from '../../../interfaces/spot'
import ticketOff from '../../../assets/ilustrations/landingpage/ticketOff.svg'
import { timeStampToString } from '../../../utils/formater/date'
import ModalBuyTicket from '../buyTicket/index'
import Button from '../../Buttons'
import { useNavigate } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import ButtonsArrow from '../../Buttons/arrows'

import './styles.scss'

function ModalWinnerRaffle({ raffleSelected, navigate }: { navigate: Function; raffleSelected: any }) {
  const { t } = useTranslation(['home'])
  const context: any = useContext(AppContext)
  const [spots, setspots] = useState([])
  const [loading, setLoading] = useState(false)
  const [availabeSpots, setAvailabeSpots] = useState([])
  const [skip, setSkip] = useState(0)
  const [limit, setlimit] = useState(15)

  const configModalSeeMyRaffles = {
    title: 'Your raffle spots',
    onPressButton: () => {
      context.changeContext({ showModal: null })
    },
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
      minWidth: '28vw',
      minHeight: '55vh'
    }
  }

  const calculateLimit = () => {
    setlimit(skip + 15 > raffleSelected?.spotTicketsBougthInRaffle ? raffleSelected?.spotTicketsBougthInRaffle : skip + 15)
  }

  const paginationSlice = () => {
    let list = raffleSelected?.spotTicketsBougthInRaffle
    if (!Array.isArray(list)) return []

    if (skip == 0 && limit == 0) return list

    return list.slice(skip, limit)
  }

  useEffect(() => {
    calculateLimit()
  }, [, skip])

  return (
    <FullModal
      showModal={true}
      config={{
        ...configModalSeeMyRaffles,
        buttonTxt: 'Done',
        width: isMobile && '90%',
        footer: () => (
          <>
            <Button
              text={t('modalWinnerRaffle.buttonText')}
              onPress={() => {
                context.changeContext({ showModal: null })
                navigate(`/ticket-details-screen/${raffleSelected?.raffleSmartContractAddress}`)
              }}
              className={'buttonGoToTheRaffle '}
            />
          </>
        )
      }}
    >
      {loading ? (
        <div className="mt-10">
          <LoaderComponent logo />
        </div>
      ) : (
        <>
          <div className="textWinnerModal">
            {raffleSelected?.userWinnerInRaffle && raffleSelected?.raffleStatus == 'closed' ? (
              <h4 style={{ lineHeight: '150%', fontSize: '12px' }}>Congratulations, you have won this raffle!</h4>
            ) : !raffleSelected?.userWinnerInRaffle && raffleSelected?.raffleStatus == 'closed' ? (
              <h4 style={{ lineHeight: '150%', fontSize: '12px' }}>You were not a winner this time. Good luck next time!</h4>
            ) : (
              <h4 style={{ lineHeight: '150%', fontSize: '12px' }}>This raffle is still open. You can buy more tickets to ensure your victory!</h4>
            )}
          </div>
          <div className="ContainerAllSpots">
            <div className={`containerRafflePointsModal grid-${raffleSelected?.spotTicketsBougthInRaffle ? true : false}`}>
              <>
                {paginationSlice()?.map((spot: spotInterface) => {
                  return <RafflePoints active number={spot} winner={raffleSelected?.raffleWinnerSpotPosition == spot && raffleSelected?.userWinnerInRaffle} />
                })}
              </>
            </div>
            <div className="grid-points-buttons" style={{ marginTop: '20px', display: 'flex' }}>
              <div className={skip == 0 ? `hidden left` : 'left'} style={raffleSelected?.spotTicketsBougthInRaffle?.length <= 15 ? { display: 'none', marginRight: '8px' } : { marginRight: '8px' }}>
                <ButtonsArrow
                  onPress={() => {
                    if (skip != 0) {
                      setSkip(skip - 15)
                    }
                  }}
                />
              </div>
              <div className={skip + 15 >= raffleSelected?.spotTicketsBougthInRaffle?.length ? 'hidden' : ''} style={raffleSelected?.spotTicketsBougthInRaffle?.length <= 15 ? { display: 'none', marginLeft: '8px' } : { marginLeft: '8px' }}>
                <ButtonsArrow
                  right
                  onPress={() => {
                    if (skip + 15 < raffleSelected?.spotTicketsBougthInRaffle?.length) {
                      setSkip(skip + 15)
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <h3 className="titleRafflePointsModal">
            <div>
              <span>Draw{raffleSelected?.raffleStatus == 'closed' && 'n'}:</span> {timeStampToString(raffleSelected?.dateOfDraw! * 1000, 1)}
            </div>
          </h3>
          <h3 className="titleRafflePointsModal titleRafflePointsModalsecond">
            {raffleSelected?.raffleStatus == 'closed' && (
              <div>
                <span>Winner spot: {raffleSelected?.raffleWinnerSpotPosition}</span>
              </div>
            )}
          </h3>
          {raffleSelected?.userWinnerInRaffle && (
            <div style={{ marginBottom: '20px' }}>
              <img className="winnerspotsvg" src={Win} />
            </div>
          )}
        </>
      )}
    </FullModal>
  )
}

export default ModalWinnerRaffle
