import {Client} from '@stomp/stompjs';

// Bear Token 가져오기

const socket = new Client({
  brokerURL: 'ws://localhost:8080/ws',
  connectHeaders: {
    // Authorization: `Bearer ${token}`,
  },
  debug: str => {
    console.log(str);
  },
  reconnectDelay: 5000,
  // heartbeatIncoming: 4000,
  // heartbeatOutgoing: 4000,

  onConnect: () => {
    console.log('소켓 연결 성공');
    // 산책 기록 위치 수집
    socket.subscribe('sub/explorations/{explorationId}', message => {
      console.log('Received message from /topic/public:', message.body);
    });
    // 개인 블루존 조회
    socket.subscribe('sub/users/{userId}/bluezone', message => {
      console.log('개인 블루존 조회', message.body);
    });
    // 전체 블루존 조회
    socket.subscribe('sub/bluezone', message => {
      console.log('Received message from /user/queue/errors:', message.body);
    });
    // 전체 레드존 조회
    socket.subscribe('sub/redzone', message => {
      console.log('Received message from /user/queue/errors:', message.body);
    });

    // 마커 조회
    socket.subscribe('sub/markers', message => {
      console.log('Received message from /user/queue/errors:', message.body);
    });
  },

  onStompError: frame => {
    console.log('에러 메시지: ' + frame.headers['message']);
    console.log('에러 상세 내용: ' + frame.body);
  },
});

// 클라이언트 활성화
socket.activate();

export default socket;
