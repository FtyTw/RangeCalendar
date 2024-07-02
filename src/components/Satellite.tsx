import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';
import React from 'react';
import { View } from 'react-native';
import { CalendarContextValues, SatelliteProps } from '../types';

export const Satellite = ({
  translateYB,
  translateXA,
  translateXB,
  translateYA,
  dayWidth = 40,
}: SatelliteProps) => {
  const position = useAnimatedStyle(() => {
    const sameY = translateYA.value === translateYB.value;
    return {
      top: translateYB.value,
      left: sameY ? translateXA.value + dayWidth : 0,
      width: translateXB.value - (sameY ? translateXA.value : 0),
    };
  });
  const width = useAnimatedStyle(() => {
    const sameY = translateYA.value === translateYB.value;
    return {
      width: translateXB.value - (sameY ? translateXA.value : 0),
    };
  });
  return (
    <Reanimated.View
      style={[
        {
          width: 40,
          height: 40,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
        },
        position,
      ]}>
      <Reanimated.View
        style={[{ width: 40, height: 20, backgroundColor: 'lightblue' }, width]}
      />
    </Reanimated.View>
  );
};

export const SatelliteLeft = ({
  translateYB,
  translateXA,
  translateXB,
  translateYA,
  dayWidth = 40,
}: SatelliteProps) => {
  const position = useAnimatedStyle(() => {
    const sameY = translateYA.value === translateYB.value;
    return {
      top: translateYA.value,
      left: translateXA.value + dayWidth,
      width: sameY
        ? translateXB.value - translateXA.value
        : dayWidth * 6 - translateXA.value,
    };
  });
  return (
    <Reanimated.View
      style={[
        {
          width: 40,
          height: 40,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
        },
        position,
      ]}>
      <View style={{ width: 40, height: 20, backgroundColor: 'red' }} />
    </Reanimated.View>
  );
};
