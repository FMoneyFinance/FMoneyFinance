import { raffleGraphReference } from '../../interfaces/raffles'
import { timeStampToString } from '../formater/date'

export const raffleGraphReferencesToGraphDate = (payload: Array<raffleGraphReference>): Array<any> => {
  const graphData: Array<any> = []

  if (!payload) return []

  payload.map((graphReference) => {
    const itemGraph = {
      timestamp: graphReference.timestampOfTheReference,
      prize: graphReference.prizePotReference,
      date: timeStampToString(graphReference.timestampOfTheReference, 2)
    }

    graphData.push(itemGraph)
  })

  return graphData
}
