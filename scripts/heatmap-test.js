import http from 'k6/http';
import ws from 'k6/ws';
import { check,  } from 'k6';
import { Trend, Counter } from 'k6/metrics';

// STOMP message response 시간을 측정하는 메트릭 (초 단위)
let messageLatency = new Trend('message_latency', true);
let messageCounter = new Counter('message_counter');
let receivedMessageCount = new Counter('received_message_count');

const url = 'ws://host.docker.internal:8080/ws';
const loginUrl = 'http://host.docker.internal:8080/manager/login';

// 요청 ID에 대한 시작 시간을 저장하는 Map
let requestTimestamps = new Map();

export const options = {
    stages: [
        { duration: '1s', target: 1 },

        { duration: '20s', target: 100 },
        { duration: '20s', target: 200 },
        { duration: '20s', target: 300 },
        { duration: '20s', target: 400 },
        { duration: '20s', target: 500 },
        { duration: '20s', target: 600 },
        { duration: '20s', target: 700 },
        { duration: '20s', target: 800 },
        { duration: '20s', target: 900 },
        { duration: '20s', target: 1000 },
        { duration: '120s', target: 0 },
    ],
};

// 사용자 ID를 받아 JWT 토큰을 가져오는 함수
function getJwtToken(userId) {
    const res = http.post(`${loginUrl}?username=manager${userId}`);
    const token = res.json().accessToken;
    check(res, {
        'login successful': (r) => r.status === 200,
        'token exists': (r) => token !== undefined,
    });
    return token;
}

export default function () {
    // __VU는 Virtual User ID로, 1부터 시작하여 사용자가 증가할 때마다 1씩 증가합니다.
    const userId = __VU;

    // JWT 토큰을 가져와서 WebSocket 연결에 사용
    const token = getJwtToken(userId);

    // WebSocket 연결
    const response = ws.connect(url + `?Authorization=${token}`, {}, function (socket) {
        socket.on('open', function () {
            console.log(`User ${userId} connected to WebSocket server`);

            // SUBSCRIBE 프레임을 통해 메시지 구독
            const connectFrame = 'CONNECT\naccept-version:1.1,1.0\nhost:localhost\n\n\0';
            socket.send(connectFrame);

            // SUBSCRIBE 프레임을 통해 메시지 구독
            const subscribeFrame = `SUBSCRIBE\nid:sub-${userId}\ndestination:/user/sub/bluezone\n\n\0`;
            socket.send(subscribeFrame);

            // 5초마다 STOMP SEND 프레임으로 heatmap 요청 전송
            socket.setInterval(function () {
                const requestId = Math.random().toString(36).substr(2, 9); // 고유한 요청 ID 생성
                const startTime = new Date();  // 요청 전송 시작 시간

                const message = JSON.stringify({
                    requestId: requestId, // 고유한 ID 추가
                    side: 500,
                    point: {
                        lat: 35.085639,  // 위도
                        lon: 128.87754,  // 경도
                    },
                });

                const sendFrame = `SEND\ndestination:/pub/bluezone\ncontent-type:application/json\n\n${message}\0`;
                socket.send(sendFrame);
                messageCounter.add(1);

                socket.on('message', function (msg) {
                    if(msg.indexOf(requestId) !== -1){
                        const endTime = new Date();
                        const latency = (endTime - startTime);  // 응답 시간(초) 계산

                        receivedMessageCount.add(1);  // 1초를 넘기면 카운트 증가
                        messageLatency.add(latency);
                    }
                });

                console.log(`User ${userId} sent heatmap request at ${startTime} with requestId: ${requestId}`);
            }, 15000);  // 5초마다 요청 전송
        });

        socket.on('close', function () {
            console.log(`User ${userId} disconnected from WebSocket server`);
        });

        socket.on('error', function (e) {
            console.error(`User ${userId} WebSocket error: `, e);
        });
    });

    check(response, {
        'WebSocket connection successful': (r) => r && r.status === 101,
    });
}
