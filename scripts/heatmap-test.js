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
const url = 'ws://localhost:8080/ws';
const loginUrl = 'http://localhost:8080/manager/login';

// export const options = {
//     stages: [
//         { duration: '0s', target: 100 },  // 100명으로 증가
//         { duration: '60s', target: 100 },  // 60초 동안 500명 유지
//         { duration: '60s', target: 100 },  // send 종료, 응답을 받는 시간
//         { duration: '60s', target: 0 },  // 60초 동안 500명 유지
//     ],
// };

export const options = {
    scenarios: {
        contacts: {
            executor: 'constant-vus',
            vus: 10,
            duration: '10s',
            gracefulStop: '3s',
        },
    }
};

export default function () {
    const userId = __VU;
    const token = getJwtToken(userId);

    const response = ws.connect(url + `?Authorization=${token}`, {}, function (socket) {

        socket.on('open', function () {
            handleConnect(socket, userId);
        });

        socket.on('message', function (msg) {
            handleMessage(msg);
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


function getSendFrame(message) {
    return `SEND\ndestination:/pub/bluezone\ncontent-type:application/json\n\n${message}\0`;
}

function getConnectFrame() {
    return 'CONNECT\naccept-version:1.1,1.0\nhost:localhost\n\n\0';
}

function getSubscribeFrame(userId) {
    return `SUBSCRIBE\nid:sub-${userId}\ndestination:/user/sub/bluezone\n\n\0`;
}


function getJwtToken(userId) {
    const res = http.post(`${loginUrl}?username=manager${userId}`);
    const token = res.json().accessToken;
    check(res, {
        'login successful': (r) => r.status === 200,
        'token exists': (r) => token !== undefined,
    });
    return token;
}

function sendMessage(socket) {
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTestTime) / 1000;

    if (elapsedTime > 30) return;

    const requestId = Math.random().toString(36).substr(2, 9);
    const startTime = new Date();

    const message = JSON.stringify({
        side: 500,
        point: {
            lat: 35.09493885488935,
            lon: 128.853454676335,
        },
    });

    const sendFrame = getSendFrame(message);
    socket.send(sendFrame);

    messageCounter.add(1);

    requestTimestamps.set(requestId, startTime);
    requestResponseDifferenceRate.add(false);
}

function handleConnect(socket, userId) {
    console.log(`User ${userId} connected to WebSocket server`);

    const connectFrame = getConnectFrame();
    socket.send(connectFrame);

    const subscribeFrame = getSubscribeFrame(userId);
    socket.send(subscribeFrame);

    sendMessage(socket, userId);
}

function handleMessage(msg) {
    if(msg.startsWith("CONNECT")) return;

    requestResponseDifferenceRate.add(true);
}

