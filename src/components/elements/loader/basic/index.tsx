import React from 'react'
import BasicSpinnerSvg from '../../../../assets/ilustrations/basicSpinner.webp'
import BasicSpinnerGreen from '../../../../assets/ilustrations/loader.webp'
import '../index.scss'

function BasicSpinner({ green }: any) {
  return <img style={{ marginTop: '0px' }} className="basicSpinner rotate" src={green ? BasicSpinnerGreen : BasicSpinnerSvg} />
}

export default BasicSpinner
