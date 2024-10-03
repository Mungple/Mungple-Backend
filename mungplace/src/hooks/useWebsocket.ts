import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

interface Point {
  latitude: number;
  longitude: number;
}

interface Cell {
  point: Point;
  weight: number;
}

interface FromZone {
  cells: Cell[];
}

interface MungZone {
  points: Point[];
}

interface ErrorMessage {
  errorCode: string;
  message: string;
}

const WEBSOCKET_URI = 'wss://j11e106.p.ssafy.io/api/ws';

// JWT 토큰을 캐싱할 변수
let cachedToken: string | null = null;

// JWT 토큰을 가져오는 함수
const getJwtToken = async () => {
  if (cachedToken) {
    return cachedToken;
  }
  try {
    const response = await axios.post(
      `https://j11e106.p.ssafy.io/api/manager/login?username=manager`,
    );
    console.log('JWT Token을 가져오기 성공했습니다.');
    cachedToken = response.data.accessToken;
    return cachedToken;
  } catch (error) {
    console.error('JWT Token을 가져오는 데 실패했습니다.', error);
    return null;
  }
};

const useWebSocket = (explorationId: number = -1) => {
  const [clientSocket, setClientSocket] = useState<Client | null>(null);
  const [explorations, setExplorations] = useState<ErrorMessage | null>(null);
  const [myBlueZone, setMyBlueZone] = useState<FromZone | null>(null);
  const [allBlueZone, setAllBlueZone] = useState<FromZone | null>(null);
  const [allRedZone, setAllRedZone] = useState<FromZone | null>(null);
  const [mungZone, setMungZone] = useState<MungZone | null>(null);

  // 토큰을 재사용하기 위해 ref 사용
  const tokenRef = useRef<string | null>(null);

  // 소켓 연결 시도
  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        if (!tokenRef.current) {
          tokenRef.current = await getJwtToken();
        }
        if (!tokenRef.current) {
          console.error('토큰을 가져올 수 없어 소켓 연결을 시도할 수 없습니다.');
          return;
        }

        const socket = new Client({
          webSocketFactory: () =>
            new WebSocket(`${WEBSOCKET_URI}?Authorization=${tokenRef.current}`),
          debug: (str) => {
            console.log(str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            console.log('소켓 연결 성공');
            setClientSocket(socket);

            // 메시지 구독
            subscribeToTopics(socket, explorationId);
          },
          onStompError: (frame) => {
            console.error('소켓 연결 에러 발생: ', frame.headers['message']);
          },
        });

        socket.activate();
        return () => {
          socket.deactivate();
          setClientSocket(null);
        };
      } catch (error) {
        console.error('웹 소켓 에러 발생', error);
      }
    };

    connectWebSocket();
  }, [explorationId]);

  const subscribeToTopics = (socket: Client, explorationId: number) => {
    // 에러 메시지 수신
    socket.subscribe('/user/sub/errors', (message) => {
      console.error('Error message received:', message.body);
    });

    // 산책 기록 위치 수집
    socket.subscribe(`/user/sub/explorations/${explorationId}`, (message) => {
      try {
        const parsedMessage = JSON.parse(message.body) as ErrorMessage;
        setExplorations(parsedMessage);
      } catch (e) {
        console.error('Error parsing exploration message:', e);
      }
    });
    // 개인 블루존 조회
    socket.subscribe('/user/sub/users/bluezone', (message) => {
      try {
        const parsedMessage = JSON.parse(message.body) as FromZone;
        setMyBlueZone(parsedMessage);
<<<<<<< HEAD
        console.log("하이요",parsedMessage)
=======
>>>>>>> ee4e8aaaae6673b963a56afae64fe1973b98b849
      } catch (e) {
        console.error('Error parsing bluezone message:', e);
      }
    });
    // 전체 블루존 조회
    socket.subscribe('/user/sub/bluezone', (message) => {
      try {
        const parsedMessage = JSON.parse(message.body) as FromZone;
        setAllBlueZone(parsedMessage);
      } catch (e) {
        console.error('Error parsing bluezone message:', e);
      }
    });
    // 전체 레드존 조회
    socket.subscribe('/user/sub/redzone', (message) => {
      try {
        const parsedMessage = JSON.parse(message.body) as FromZone;
        setAllRedZone(parsedMessage);
      } catch (e) {
        console.error('Error parsing redzone message:', e);
      }
    });
    // 멍플 조회
    socket.subscribe('/user/sub/mungplace', (message) => {
      try {
        const parsedMessage = JSON.parse(message.body) as MungZone;
        setMungZone(parsedMessage);
      } catch (e) {
        console.error('Error parsing mungplace message:', e);
      }
    });
  };

  return {
    clientSocket,
    explorations,
    myBlueZone,
    allBlueZone,
    allRedZone,
    mungZone,
  };
};

export default useWebSocket;
