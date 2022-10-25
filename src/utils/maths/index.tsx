export const getTimeToDate = (timestamp: any, toNow?: boolean): number => {
  const now = Date.now()
  const date2: any = new Date(timestamp)

  const diffTime = Math.abs(date2 - now)

  return diffTime
}
