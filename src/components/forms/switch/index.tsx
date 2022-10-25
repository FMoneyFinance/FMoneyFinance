import React from 'react'
import ReactSwitch from 'react-switch'

function SwitchComponent({ handleChange, value }: any) {
  return <ReactSwitch onChange={handleChange} height={20} offHandleColor="#D4D6D9" onHandleColor="#D4D6D9" onColor="#629A48" offColor="#EFEFEF" checkedIcon={false} uncheckedIcon={false} checked={value} />
}

export default SwitchComponent
