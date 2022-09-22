import React from 'react'

function Divider({ config }: any) {
  const styles = {
    backgroundColor: '#0000001A',
    height: '2px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: config?.width || '100%'
  }

  return <div style={styles} />
}

export default Divider
