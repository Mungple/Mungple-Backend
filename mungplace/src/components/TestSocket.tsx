import React from 'react';
import {View, Text, Button} from 'react-native';
import useWebSocket from '@/hooks/useWebsocket';

const TestSocket = () => {
  const {
    explorations,
    myBlueZone,
    allBlueZone,
    allRedZone,
    mungZone,
    sendLocation,
    checkMyBlueZone,
    checkAllUserZone,
    checkMungPlace,
  } = useWebSocket();

  return (
    <View>
      <Text>Test Socket</Text>
      <Button
        title="sendLocation"
        onPress={() =>
          sendLocation(1, {
            lat: 35.06005,
            lon: 129.0145,
            recordedAt: '2021-09-01T00:00:00',
          })
        }
      />
      <Button
        title="checkMyBlueZone"
        onPress={() =>
          checkMyBlueZone({
            side: 1000,
            point: {
              lat: 35.06005,
              lon: 129.0145,
            },
          })
        }
      />
      <Button
        title="checkAllBlueZone"
        onPress={() =>
          checkAllUserZone(0, {
            side: 1000,
            point: {
              lat: 35.06005,
              lon: 129.0145,
            },
          })
        }
      />
      <Button
        title="checkAllRedZone"
        onPress={() =>
          checkAllUserZone(1, {
            side: 1000,
            point: {
              lat: 35.06005,
              lon: 129.0145,
            },
          })
        }
      />
      <Button title="checkMungPlace" onPress={() => checkMungPlace} />
      {/* 현재 수신된 데이터 출력 */}
      {explorations && (
        <Text>Explorations: {JSON.stringify(explorations)}</Text>
      )}
      {myBlueZone && <Text>My BlueZone: {JSON.stringify(myBlueZone)}</Text>}
      {allBlueZone && <Text>All BlueZone: {JSON.stringify(allBlueZone)}</Text>}
      {allRedZone && <Text>All RedZone: {JSON.stringify(allRedZone)}</Text>}
      {mungZone && <Text>MungZone: {JSON.stringify(mungZone)}</Text>}
    </View>
  );
};

export default TestSocket;
