import _ from 'lodash'
import { raffleInterface } from '../../interfaces/raffles'
import { useTranslation } from 'react-i18next'

export const checkGetRafflesInfo = (context: any) => {
  if (context.state?.rafflesInfo) {
    return context.state?.rafflesInfo
  }
}

export const getNextDraw = (context: any) => {
  const draws = checkGetRafflesInfo(context)
  const drawSorted = _.sortBy(draws, 'timestampDateOfDraw')?.filter((e: any) => e.raffleStatus == 'open')

  return drawSorted[0]?.timestampDateOfDraw
}

export const getRaffleOfSocket = (rafflesList: Array<raffleInterface>, raffleSmartContractAddress: string) => {
  let raffleSelected: any = {}

  if (Array.isArray(rafflesList)) {
    raffleSelected = rafflesList.find((raffle: any) => raffle.raffleSmartContractAddress == raffleSmartContractAddress)
  }

  return raffleSelected
}

export const getColorOfStatus = (raffleStatus: string): string => {
  const colors: any = {
    open: '#22C55E',
    raffling: '#F7DB49',
    closed: '#EF4444'
  }
  return colors[raffleStatus] || ''
}

export const getNameOfStatus = (raffleStatus: string): string => {
  const { t } = useTranslation(['raffleStatus'])
  const colors: any = {
    open: t('open'),
    raffling: t('raffling'),
    closed: t('closed')
  }
  return colors[raffleStatus] || ''
}

export const deleteFakeRaffles = (raffleList: Array<any>): Array<any> => {
  const realCreating = raffleList?.filter((raffle: any) => raffle?.raffleStatus == 'creating' && !raffle.fake)?.map((raffle: raffleInterface) => `${raffle.percentageOfPrizeToOperator}${raffle.currentNumOfPlayers}${raffle.priceOfTheRaffleTicketInUSDC}`)

  const newList: Array<any> = raffleList?.filter((raffle: any) => {
    const fakeId: string = `${raffle.percentageOfPrizeToOperator}${raffle.currentNumOfPlayers}${raffle.priceOfTheRaffleTicketInUSDC}`
    return !raffle.fake || (raffle.fake && !realCreating.includes(fakeId))
  })

  return newList
}

export const lastTimeStamp = async (context: any) => {
  const filterAvailableRaffles = context?.state?.rafflesInfo?.filter((data: any) => data?.currentNumOfPlayers < data?.maxNumberOfPlayers)
  const minTimeStamp = Math.min(...filterAvailableRaffles?.map((data: any) => data.timestampDateOfDraw))
  const found = context?.state?.rafflesInfo?.find((data: any) => data.timestampDateOfDraw == minTimeStamp)
  return found
}
