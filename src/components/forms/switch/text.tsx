import React from 'react'
import './index.scss'

function SwitchText({ label1, label2, active, setActive }: any) {
  const Item = ({ label, active }: any) => {
    return (
      <div className={'switch-text-item pointer switch-text-item-' + active} onClick={setActive}>
        <span>{label}</span>
      </div>
    )
  }

  return (
    <div className="switchText">
      <Item label={label1} active={active} />
      <Item label={label2} active={!active} />
    </div>
  )
}

export default SwitchText
