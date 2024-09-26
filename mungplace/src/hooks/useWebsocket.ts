import {useState, useEffect, useCallback} from 'react';
import {Client} from '@stomp/stompjs';
import axios from 'axios';

interface Point {
  latitude: number;
  longitude: number;
}

interface Cell {
  point: Point;
  weight: number;
}

// SEND: 산책 위치 정보
interface ToLocation {
  lat: number;
  lon: number;
  recordedAt: string;
}
// SEND: 개인 블루존, 블루존, 레드존
interface ToZone {
  side: number;
  point: {
    lat: number;
    lon: number;
  };
}
// RECEIVE: 개인 블루존, 블루존, 레드존
interface FromZone {
  cells: Cell[];
}

interface MungZone {
  points: Point[];
}
// RECEIVE: 에러 메시지
interface ErrorMessage {
  errorCode: string;
  message: string;
}

// WebSocket 서버 URI
const WEBSOCKET_URI = 'wss://j11e106.p.ssafy.io/api/ws';

// JWT 토큰을 가져오는 함수
const getJwtToken = async () => {
  try {
    const response = await axios.post(
      `https://j11e106.p.ssafy.io/api/manager/login?username=manager`,
    );
    console.log('JWT Token을 가져오기 성공했습니다.');
    return response.data.accessToken;
  } catch (error) {
    console.error('JWT Token을 가져오는 데 실패했습니다.', error);
  }
};

const useWebSocket = (explorationId: number = -1) => {
  const [clientSocket, setClientSocket] = useState<Client | null>(null);
  const [explorations, setExplorations] = useState<ErrorMessage | null>(null);
  const [myBlueZone, setMyBlueZone] = useState<FromZone | null>(null);
  const [allBlueZone, setAllBlueZone] = useState<FromZone | null>(null);
  const [allRedZone, setAllRedZone] = useState<FromZone | null>(null);
  const [mungZone, setMungZone] = useState<MungZone | null>(null);

  useEffect(() => {
    const connectWebsocket = async () => {
      try {
        let token = await getJwtToken();
        let tries = 0;

        while (!token && tries < 3) {
          console.log('토큰이 없습니다. 재시도 중...');
          token = await getJwtToken();
          tries++;
        }

        if (!token) {
          console.error(
            '토큰을 가져올 수 없어 소켓 연결을 시도할 수 없습니다.',
          );
          return;
        }

        const socket = new Client({
          webSocketFactory: () =>
            new WebSocket(`${WEBSOCKET_URI}?Authorization=${token}`),
          debug: str => {
            console.log(str);
          },
          beforeConnect: () => {
            console.log('소켓 연결 시도 중');
          },
          appendMissingNULLonIncoming: true, // 서버로부터 받은 메시지에 NULL 문자가 없을 때 추가(RN Polyfill)
          forceBinaryWSFrames: true, // WebSocket 프레임을 항상 바이너리로 설정(RN Polyfill)
          reconnectDelay: 5000, // 재연결 시도 간격
          heartbeatIncoming: 4000, // 서버로부터 메시지를 받는 주기
          heartbeatOutgoing: 4000, // 서버로 메시지를 보내는 주기

          onConnect: () => {
            console.log('소켓 연결 성공');
            setClientSocket(socket);
            // 에러 메시지 수신
            socket.subscribe('/user/sub/errors', message => {
              console.error('Error message received:', message.body);
            });

            // 산책 기록 위치 수집
            socket.subscribe(
              `/user/sub/exploration/${explorationId}`,
              message => {
                try {
                  const parsedMessage = JSON.parse(
                    message.body,
                  ) as ErrorMessage;
                  setExplorations(parsedMessage);
                } catch (e) {
                  console.log(e);
                }
              },
            );
            // 개인 블루존 조회
            socket.subscribe('/user/sub/users/bluezone', message => {
              try {
                const parsedMessage = JSON.parse(message.body) as FromZone;
                setMyBlueZone(parsedMessage);
              } catch (e) {
                console.log(e);
              }
            });
            // 전체 블루존 조회
            socket.subscribe('/user/sub/bluezone', message => {
              try {
                const parsedMessage = JSON.parse(message.body) as FromZone;
                // console.log(parsedMessage);
                setAllBlueZone(parsedMessage);
              } catch (e) {
                console.log(e);
              }
            });
            // 전체 레드존 조회
            socket.subscribe('/user/sub/redzone', message => {
              try {
                const parsedMessage = JSON.parse(message.body) as FromZone;
                setAllRedZone(parsedMessage);
              } catch (e) {
                console.log(e);
              }
            });
            // 멍플 조회
            socket.subscribe('/user/sub/mungplace', message => {
              try {
                const parsedMessage = JSON.parse(message.body) as MungZone;
                setMungZone(parsedMessage);
              } catch (e) {
                console.log(e);
              }
            });
          },

          onStompError: frame => {
            console.log('소켓 연결 에러 발생');
            console.log('에러 메시지: ' + frame.headers['message']);
            console.log('에러 상세 내용: ' + frame.body);
          },
        });

        socket.activate();
      } catch (error) {
        console.error('웹 소켓 에러 발생', error);
      }

      return () => {
        if (clientSocket) {
          clientSocket.deactivate();
          setClientSocket(null);
        }
      };
    };
    connectWebsocket();
  }, [explorationId]);

  const sendLocation = useCallback(
    (explorationId: number, location: ToLocation) => {
      if (clientSocket && clientSocket.connected) {
        clientSocket.publish({
          destination: `/user/pub/explorations/${explorationId}`,
          body: JSON.stringify(location),
        });
      } else {
        console.log('소켓 연결이 되어있지 않습니다.');
      }
    },
    [clientSocket],
  );

  const checkMyBlueZone = useCallback(
    (myBlueZone: ToZone) => {
      if (clientSocket && clientSocket.connected) {
        clientSocket.publish({
          destination: '/user/pub/users/bluezone',
          body: JSON.stringify(myBlueZone),
        });
      } else {
        console.log('소켓 연결이 되어있지 않습니다.');
      }
    },
    [clientSocket],
  );

  const checkAllUserZone = useCallback(
    (zoneType: number, allUserZone: ToZone) => {
      if (clientSocket && clientSocket.connected) {
        // zoneType: 0(블루존), 1(레드존)
        if (zoneType === 0) {
          clientSocket.publish({
            destination: '/pub/bluezone',
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

  const checkMungPlace = useCallback(
    (allUserZone: ToZone) => {
      if (clientSocket && clientSocket.connected) {
        clientSocket.publish({
          destination: '/user/pub/mungplace',
          body: JSON.stringify(allUserZone),
        });
      } else {
        console.log('소켓 연결이 되어있지 않습니다.');
      }
    },
    [clientSocket],
  );

  return {
    clientSocket,
    explorations,
    myBlueZone,
    allBlueZone,
    allRedZone,
    mungZone,
    sendLocation,
    checkMyBlueZone,
    checkAllUserZone,
    checkMungPlace,
  };
};

export default useWebSocket;
