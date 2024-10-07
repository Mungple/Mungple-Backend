import { useCallback, useEffect } from 'react';

import { useAppStore } from '@/state/useAppStore';
import { ToLocation, ToMungZone, ToZone } from '@/types';

const useWebSocketActions = () => {
  const { clientSocket } = useAppStore((state) => state);

  useEffect(() => {
    if (!clientSocket || !clientSocket.connected) {
      console.log('WebSocket이 아직 초기화되지 않았습니다. 기다리는 중...');
    }
  }, [clientSocket]);

  const sendLocation = (explorationId: number, location: ToLocation) => {
    if (clientSocket?.connected) {
      clientSocket.publish({
        destination: `/pub/explorations/${explorationId}`,
        body: JSON.stringify(location),
      });
    } else {
      console.error('sendLocation 소켓 연결이 되어있지 않습니다.');
    }
  };

  const checkMyBlueZone = useCallback(
    (myBlueZone: ToZone) => {
      if (clientSocket?.connected) {
        clientSocket.publish({
          destination: '/pub/users/bluezone',
          body: JSON.stringify(myBlueZone),
        });
      } else {
        console.log('checkMyBlueZone 소켓 연결이 되어있지 않습니다.');
      }
    },
    [clientSocket],
  );

  const checkAllUserZone = useCallback(
    (zoneType: number, allUserZone: ToZone) => {
      if (clientSocket?.connected) {
        const destination = zoneType === 0 ? '/pub/bluezone' : '/pub/redzone';
        clientSocket.publish({
          destination,
          body: JSON.stringify(allUserZone),
        });
      } else {
        console.log('checkAllUserZone 소켓 연결이 되어있지 않습니다.');
      }
    },
    [clientSocket],
  );

  const checkMungPlace = useCallback(
    (allUserZone: ToMungZone) => {
      if (clientSocket?.connected) {
        clientSocket.publish({
          destination: '/user/pub/mungplace',
          body: JSON.stringify(allUserZone),
        });
      } else {
        console.log('checkMungPlace 소켓 연결이 되어있지 않습니다.');
      }
    },
    [clientSocket],
  );

  return {
    sendLocation,
    checkMyBlueZone,
    checkAllUserZone,
    checkMungPlace,
  };
};

export default useWebSocketActions;
