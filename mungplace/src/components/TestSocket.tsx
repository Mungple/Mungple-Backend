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
        title="checkAllUserZone"
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
      <Button title="checkMungPlace" onPress={() => checkMungPlace} />
    </View>
  );
};

export default TestSocket;
