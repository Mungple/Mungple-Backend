import {Client} from '@stomp/stompjs';

const socket = new Client({
  brokerURL: 'ws://localhost:8080/ws',
  connectHeaders: {
    login: 'guest',
    passcode: 'guest',
  },
  debug: str => {
    console.log(str);
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});

export default socket;
