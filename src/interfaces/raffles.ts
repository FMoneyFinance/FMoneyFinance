export interface raffleInterface {
  _id: string
  raffleStatus: raffleStatusEnum
  raffleName: string
  createdAt: string
  raffleSymbol: string
  raffleWinnerPlayer: string
  raffleTxHashOfDraw: string
  raffleGraphReferences: Array<raffleGraphReference>
  raffleTxHashCreation: string
  maxNumberOfPlayers: number
  raffleTxHashOfSetWinner: string
  raffleWinnerSpotPosition: number
  raffleSmartContractAddress: string
  timestampDateOfDraw: number
  currentPrizePot: number
  spotTicketsBougthInRaffle: Array<number>
  numOfSpotTicketsBougthInRaffle?: number
  currentNumOfPlayers?: number
  prizeWonByWinner?: number
  dateOfDraw?: number
  percentageOfPrizeToOperator: number
  priceOfTheRaffleTicketInUSDC: number
  userWinnerInRaffle: boolean
  __v?: number
}

export interface raffleGraphReference {
  _id: string
  raffleStatus: string
  prizePotReference: number
  timestampOfTheReference: number
  dateOfTheReference: string
  raffleSmartContractAddress: string
  __v: 0
}

export enum raffleStatusEnum {
  open = 'open',
  creating = 'creating',
  closed = 'closed',
  raffling = 'raffling'
}
