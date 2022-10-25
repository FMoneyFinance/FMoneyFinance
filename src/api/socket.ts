import socketIo from 'socket.io-client'

const io: any = socketIo

export const connectToSocket = (nameOfSocket: string, callback: Function) => {
  const socketConnection = io.connect(import.meta.env.VITE_URL_SOCKET, {
    transports: ['websocket'],
    secure: true
  })

  socketConnection.on('connect', () => {
    console.log('connect socket')
  })

  socketConnection.on(nameOfSocket, callback)
  socketConnection.on('connect_error', (error: any) => {
    console.log('connect error', error)
  })
}
