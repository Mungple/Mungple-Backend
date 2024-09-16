import {useState, useEffect, useCallback} from 'react';
import {Client} from '@stomp/stompjs';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface MyBlueZone {
  userId: number;
  latitude: number;
  longitude: number;
  radius: number;
  year: number;
  month: number;
}

interface AllUserZone {
  latitude: number;
  longitude: number;
  radius: number;
}

const useWebSocket = () => {
  const [clientSocket, setClientSocket] = useState<Client | null>(null);

  // Bear Token 가져오기
  // const token = useSelector((state: RootState) => state.auth.token);
  useEffect(() => {
    const socket = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        // Authorization: `Bearer ${token}`,
      },
      debug: str => {
        console.log(str);
      },
      reconnectDelay: 5000, // 재연결 시도 간격
      // heartbeatIncoming: 4000, // 서버로부터 메시지를 받는 주기
      // heartbeatOutgoing: 4000, // 서버로 메시지를 보내는 주기

      onConnect: () => {
        console.log('소켓 연결 성공');
        setClientSocket(socket);
        // 산책 기록 위치 수집
        socket.subscribe('sub/explorations/{explorationId}', message => {
          console.log('산책 기록 위치 수집 에러 발생', message.body);
        });
        // 개인 블루존 조회
        socket.subscribe('sub/users/{userId}/bluezone', message => {
          console.log('개인 블루존 조회', message.body);
        });
        // 전체 블루존 조회
        socket.subscribe('sub/bluezone', message => {
          console.log('전체 블루존 조회', message.body);
        });
        // 전체 레드존 조회
        socket.subscribe('sub/redzone', message => {
          console.log('전체 레드존 조회', message.body);
        });
      },

      onStompError: frame => {
        console.log('소켓 연결 에러 발생');
        console.log('에러 메시지: ' + frame.headers['message']);
        console.log('에러 상세 내용: ' + frame.body);
      },
    });

    socket.activate();
    return () => {
      socket.deactivate();
      setClientSocket(null);
    };
  }, []);

  const sendLocation = useCallback(
    (explorationId: number, location: Location) => {
      if (clientSocket && clientSocket.connected) {
        clientSocket.publish({
          destination: `pub/explorations/${explorationId}`,
          body: JSON.stringify(location),
        });
      } else {
        console.log('소켓 연결이 되어있지 않습니다.');
      }
    },
    [clientSocket],
  );

  const checkMyBlueZone = useCallback(
    (myBlueZone: MyBlueZone) => {
      if (clientSocket && clientSocket.connected) {
        clientSocket.publish({
          destination: `pub/users/${myBlueZone.userId}/bluezone`,
          body: JSON.stringify(myBlueZone),
        });
      } else {
        console.log('소켓 연결이 되어있지 않습니다.');
      }
    },
    [clientSocket],
  );

  const checkALlUserZone = useCallback(
    (zoneType: number, allUserZone: AllUserZone) => {
      if (clientSocket && clientSocket.connected) {
        // zoneType: 0(블루존), 1(레드존)
        if (zoneType === 0) {
          clientSocket.publish({
            destination: 'pub/bluezone',
            body: JSON.stringify(allUserZone),
          });
        } else if (zoneType === 1) {
          clientSocket.publish({
            destination: 'pub/redzone',
            body: JSON.stringify(allUserZone),
          });
        }
      } else {
        console.log('소켓 연결이 되어있지 않습니다.');
      }
    },
    [clientSocket],
  );

  const checkMungPlace = useCallback(() => {
    if (clientSocket && clientSocket.connected) {
      clientSocket.publish({
        destination: 'pub/mungplace',
        body: JSON.stringify({}),
      });
    } else {
      console.log('소켓 연결이 되어있지 않습니다.');
    }
  }, [clientSocket]);

  return {sendLocation, checkMyBlueZone, checkALlUserZone, checkMungPlace};
};

export default useWebSocket;
