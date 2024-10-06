import http from 'k6/http';
import ws from 'k6/ws';
import { check } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

let requestTimestamps = new Map();
let messageLatency = new Trend('message_latency', true);
let messageCounter = new Counter('message_counter');
let receivedMessageCount = new Counter('received_message_count');
let requestResponseDifferenceRate = new Rate('request_response_difference_rate');

const startTestTime = new Date();
const url = 'ws://host.docker.internal:8080/ws';
const loginUrl = 'http://host.docker.internal:8080/manager/login';

export const options = {
    stages: [
        { duration: '20s', target: 100 },  // 100명으로 증가
        { duration: '20s', target: 200 },  // 200명으로 증가
        { duration: '20s', target: 300 },  // 300명으로 증가
        { duration: '20s', target: 400 },  // 400명으로 증가
        { duration: '20s', target: 500 },  // 500명으로 증가
        { duration: '60s', target: 500 },  // 60초 동안 500명 유지
        { duration: '60s', target: 500 },  // send 종료, 응답을 받는 시간
        { duration: '60s', target: 0 },  // 60초 동안 500명 유지
    ],
};

function getJwtToken(userId) {
    const res = http.post(`${loginUrl}?username=manager${userId}`);
    const token = res.json().accessToken;
    check(res, {
        'login successful': (r) => r.status === 200,
        'token exists': (r) => token !== undefined,
    });
    return token;
}

function sendMessage(socket, userId) {
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTestTime) / 1000;

    if (elapsedTime > 160) return;

    const requestId = Math.random().toString(36).substr(2, 9);
    const startTime = new Date();

    const message = JSON.stringify({
        requestId: requestId,
        side: 500,
        point: {
            lat: 35.09493885488935,
            lon: 128.853454676335,
        },
    });

    const sendFrame = `SEND\ndestination:/pub/bluezone\ncontent-type:application/json\n\n${message}\0`;
    socket.send(sendFrame);

    requestTimestamps.set(requestId, startTime);

    messageCounter.add(1);
    requestResponseDifferenceRate.add(0);
}

function handleMessage(msg) {
    if(msg.indexOf("cells") !== -1) return

    const messageParts = msg.split('\n\n');
    const requestId = messageParts[1].trim().slice(0, -1);

    if (requestTimestamps.has(requestId)) {
        const startTime = new Date(requestTimestamps.get(requestId));
        const endTime = new Date();
        const latency = (endTime - startTime);

        receivedMessageCount.add(1);
        messageLatency.add(latency);
        requestResponseDifferenceRate.add(1);

        requestTimestamps.delete(requestId);
    }
}

export default function () {
    const userId = __VU;
    const token = getJwtToken(userId);

    const response = ws.connect(url + `?Authorization=${token}`, {}, function (socket) {
        socket.on('open', function () {
            console.log(`User ${userId} connected to WebSocket server`);

            const connectFrame = 'CONNECT\naccept-version:1.1,1.0\nhost:localhost\n\n\0';
            socket.send(connectFrame);

            const subscribeFrame = `SUBSCRIBE\nid:sub-${userId}\ndestination:/user/sub/bluezone\n\n\0`;
            socket.send(subscribeFrame);

            socket.setInterval(function () {
                sendMessage(socket, userId);
            }, 15000);

            socket.on('message', function (msg) {
                handleMessage(msg);
            });
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
