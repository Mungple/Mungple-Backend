import React from 'react';
import {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native';
import styled from 'styled-components/native';

const MonthStatistics = () => {
  const [Statistics, setStatistics] = useState();

  useEffect(() => {
    // fetch data
    // setStatistics(data)
  }, []);
  return (
    <View>
      <Text>MonthStatistics</Text>
    </View>
  );
};

export default MonthStatistics;
