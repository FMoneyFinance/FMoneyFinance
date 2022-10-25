import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'

const bridge = 'https://bridge.walletconnect.org'
const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal })

export const handleConnectWallet = (connectorInstance: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      await connectorInstance.createSession()

      connectorInstance.on('connect', (error: object, payload: any) => {
        console.log(`connector.on("connect")`)

        if (error) {
          console.log('connect error', error)
          throw error
        }

        console.log('payload', payload)
        resolve({
          payload,
          success: true
        })
      })

      connectorInstance.on('disconnect', (error: object, payload: any) => {
        console.log(`connector.on("disconnect")`)

        if (error) {
          console.log('connect error', error)
          throw error
        }

        console.log('payload', payload)
        if (payload.params[0].message === 'Session Rejected') {
          resolve({
            success: false,
            message: 'The request was cancelled'
          })
        }
      })
    } catch (error) {
      console.log('errorConnecting:', error)
      resolve({
        success: false,
        message: 'There was an error in the request'
      })
    }
  })
}

export const handleKillSessionConnector = async () => {
  await connector.killSession()
  console.log('session killed')
  return true
}

export const getConnectorInstance = () => {
  return connector
}
