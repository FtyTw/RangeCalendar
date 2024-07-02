import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useCalendarContext } from '../hooks';
import { SelectionBorderProps } from '../types';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    position: 'absolute',
  },
  selectionBorder: {
    alignSelf: 'center',
  },
});

export const SelectionBorder = ({
  translateX,
  translateY,
  left,
}: SelectionBorderProps) => {
  const {
    selectionColor: backgroundColor = 'orange',
    dayHeight,
    dayWidth,
    leftSelectionBorderStyles,
    rightSelectionBorderStyles,
  } = useCalendarContext();
  const width = dayWidth;
  const height = dayHeight;
  const selectionBorderStyles = left
    ? leftSelectionBorderStyles
    : rightSelectionBorderStyles;
  const transform = useAnimatedStyle(() => {
    const opacity = +(translateX.value >= 0 && translateY.value >= 0);
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
      opacity,
    };
  });
  return (
    <Reanimated.View
      style={[
        styles.wrapper,
        {
          width,
          height,
        },
        transform,
      ]}>
      <View
        style={[
          styles.selectionBorder,
          {
            width,
            maxHeight: height,
            maxWidth: width,
            backgroundColor,
            height: dayHeight,
          },
          selectionBorderStyles,
        ]}
      />
    </Reanimated.View>
  );
};
