import numeral from 'numeral'

export const addZeroToNumber = (number: number): string => {
  if (number > 9 || number <= 0) {
    return number.toString()
  } else {
    return `0${number}`
  }
}

export const formatNumber = (number: number) => {
  if (number === 0 || number < 0.000001) {
    return numeral(number).format('0.00')
  } else if (number < 1) {
    return numeral(number).format('0.0000000000')
  } else {
    return numeral(number).format('0,0.00')
  }
}
