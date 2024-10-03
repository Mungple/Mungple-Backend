import {useCallback} from 'react'
import useWebSocket from './useWebsocket'

interface ToLocation {
  lat: number
  lon: number
  recordedAt: string
}

interface ToZone {
  side: number
  point: {
    lat: number
    lon: number
  }
}

const useWebSocketActions = () => {
  const {clientSocket} = useWebSocket()

  const sendLocation = useCallback(
    (explorationId: number, location: ToLocation) => {
      if (clientSocket?.connected) {
        clientSocket.publish({
          destination: `/user/pub/explorations/${explorationId}`,
          body: JSON.stringify(location),
        })
      } else {
        console.log('소켓 연결이 되어있지 않습니다.')
      }
    },
    [clientSocket],
  )

  const checkMyBlueZone = useCallback(
    (myBlueZone: ToZone) => {
      // console.log("연결상태확인", clientSocket.connected)
      // console.log("블루존 요청 전송:", myBlueZone);
      if (clientSocket?.connected) {
        clientSocket.publish({
          destination: '/pub/users/bluezone',
          body: JSON.stringify(myBlueZone),
        })
      } else {
        console.log('소켓 연결이 되어있지 않습니다.')
      }
    },
    [clientSocket],
  )

  const checkAllUserZone = useCallback(
    (zoneType: number, allUserZone: ToZone) => {
      if (clientSocket?.connected) {
        const destination = zoneType === 0 ? '/pub/bluezone' : '/pub/redzone'
        clientSocket.publish({
          destination,
          body: JSON.stringify(allUserZone),
        })
      } else {
        console.log('소켓 연결이 되어있지 않습니다.')
      }
    },
    [clientSocket],
  )

  const checkMungPlace = useCallback(
    (allUserZone: ToZone) => {
      if (clientSocket?.connected) {
        clientSocket.publish({
          destination: '/user/pub/mungplace',
          body: JSON.stringify(allUserZone),
        })
      } else {
        console.log('소켓 연결이 되어있지 않습니다.')
      }
    },
    [clientSocket],
  )

  return {
    sendLocation,
    checkMyBlueZone,
    checkAllUserZone,
    checkMungPlace,
  }
}

export default useWebSocketActions
