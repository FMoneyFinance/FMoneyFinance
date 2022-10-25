import React from 'react'
import './index.scss'

function AllEqualsGraphLine() {
  const DateString = ({ text }: any) => {
    return <span>{text}</span>
  }

  return (
    <>
      <div className="AllEqualsGraphLine"></div>
      <div className="AllEqualsGraphLineNumbers">
        <DateString text="2" />
        <DateString text="1" />
        <DateString text="0" />
        <DateString text="-1" />
        <DateString text="-2" />
      </div>
    </>
  )
}

export default AllEqualsGraphLine
