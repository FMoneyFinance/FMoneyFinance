import React from 'react'
import './styles.scss'

const checkBoxGreen = ({ text, check, onPress }: any) => {
  return (
    <div className="ContainerCheckBoxGreen" onClick={() => onPress()}>
      <div className="cont">
        <div style={{ marginLeft: '0px' }}>
          <input type="checkbox" checked={check} />
        </div>
        <div>{text}</div>
      </div>
    </div>
  )
}

export default checkBoxGreen
