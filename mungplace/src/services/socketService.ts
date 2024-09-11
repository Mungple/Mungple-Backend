import {useState, useEffect} from 'react';
import {Client} from '@stomp/stompjs';

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
      reconnectDelay: 5000,
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
        // 마커 조회
        socket.subscribe('sub/markers', message => {
          console.log('마커 조회', message.body);
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
    };
  }, []);

  const sendLocation = (explorationId: number, location: any) => {
    clientSocket.publish({
      destination: `pub/explorations/${explorationId}`,
      body: JSON.stringify(location),
    });
  };
};

export default useWebSocket;
