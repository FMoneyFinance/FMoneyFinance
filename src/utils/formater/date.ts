import { monthsEn, monthsEs } from '../jsons'
import { addZeroToNumber } from './number'

export const timeStampToString = (timestamp: number, mode: number): string => {
  const date = new Date(timestamp)
  const currentLanguage = localStorage.getItem('i18nextLng')

  switch (mode) {
    case 1:
      //June 06, 2022. 03:55 PM

      return `${currentLanguage === 'en' ? monthsEn[date.getMonth()] : monthsEs[date.getMonth()]} ${addZeroToNumber(date.getDate())}, ${date.getFullYear()}. ${addZeroToNumber(date.getHours())}:${addZeroToNumber(date.getMinutes())}`

    case 2:
      //19:30

      return ` ${addZeroToNumber(date.getHours())}:${addZeroToNumber(date.getMinutes())}`
    default:
      return timestamp.toString()
  }
}
