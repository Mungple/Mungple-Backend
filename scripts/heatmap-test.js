import http from 'k6/http';
import ws from 'k6/ws';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

// STOMP message response 시간을 측정하는 메트릭 (초 단위)
let messageLatency = new Trend('message_latency', true);  // 'true'는 초 단위로 측정

const url = 'ws://host.docker.internal:8080/ws';
const loginUrl = 'http://host.docker.internal:8080/manager/login';

export const options = {
    stages: [
        { duration: '1s', target: 10 },  // 10명의 가상 사용자가 1초 동안 접속
        { duration: '90s', target: 10 },  // 30초 동안 테스트 유지
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

            const message = JSON.stringify({
                side: 500,
                point: {
                    lat: 35.085639,  // 위도
                    lon: 128.87754,  // 경도
                },
            });

            // STOMP CONNECT 프레임 전송
            const connectFrame = 'CONNECT\naccept-version:1.1,1.0\nhost:localhost\n\n\0';
            socket.send(connectFrame);

            // SUBSCRIBE 프레임을 통해 메시지 구독
            const subscribeFrame = `SUBSCRIBE\nid:sub-${userId}\ndestination:/user/sub/bluezone\n\n\0`;
            socket.send(subscribeFrame);

            // STOMP SEND 프레임으로 heatmap 요청 전송
            const sendFrame = `SEND\ndestination:/pub/bluezone\ncontent-type:application/json\n\n${message}\0`;
            const startTime = new Date();  // 요청 전송 시작 시간
            socket.send(sendFrame);

            // 메시지 수신 시 응답 시간 측정
            socket.on('message', function (msg) {
                const endTime = new Date();
                const latency = (endTime - startTime) / 1000;  // 응답 시간(초) 계산
                console.log(`User ${userId} received heatmap: ${msg}`);

                // 응답 시간을 측정하여 초 단위로 저장
                messageLatency.add(latency);
                check(msg, { 'heatmap received': (m) => m.indexOf('MESSAGE') !== -1 });
            });

            // 소켓 연결을 끊지 않고 지속적으로 유지
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
