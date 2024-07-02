import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

/*** helpers ***/
import { HIT_SLOP } from '../constants';

/*** types ***/
import { ArrowProps } from '../types';

const borderWidth = 3;
const styles = StyleSheet.create({
  leftArrowStyles: {
    borderBottomWidth: borderWidth,
    borderLeftWidth: borderWidth,
  },
  rightArrowStyles: {
    borderTopWidth: borderWidth,
    borderRightWidth: borderWidth,
  },
  arrow: {
    width: 20,
    height: 20,
    transform: [{ rotate: '45deg' }],
  },
});

export const Arrow = ({ left, arrowStyles, onPress }: ArrowProps) => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      style={[
        styles.arrow,
        left ? styles.leftArrowStyles : styles.rightArrowStyles,
        arrowStyles,
      ]}
    />
  );
};
