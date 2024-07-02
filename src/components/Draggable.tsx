import React from 'react';
import { StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Reanimated, {
  runOnJS,
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { countValue, countXYWorklet } from '../helpers';

/*** styles ***/
const styles = StyleSheet.create({
  main: {
    position: 'absolute',
    zIndex: 10000,
    flexDirection: 'row',
  },
});

export const Draggable = ({
  initialX: translateX,
  initialY: translateY,
  oppositeX,
  oppositeY,
  left,
  children,
  onEnd,
  maxSlideCoords,
  dayHeight = 40,
  dayWidth = 40,
  containerHeight = 40 * 6,
}: {
  initialX: SharedValue<number>;
  initialY: SharedValue<number>;
  oppositeX: SharedValue<number>;
  oppositeY: SharedValue<number>;
  left?: boolean;
  children?: JSX.Element;
  onEnd?: (coords: Partial<any>) => void;
  maxSlideCoords?: SharedValue<any | undefined>;
  dayHeight: number;
  dayWidth: number;
  containerHeight: number;
}) => {
  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      const x = event.translationX + context.translateX;
      const { y } = countXYWorklet(
        x,
        event.translationY + context.translateY,
        false,
        false,
        dayWidth,
        dayHeight,
      );

      if (
        (typeof maxSlideCoords?.value?.x === 'number' &&
          typeof maxSlideCoords?.value?.y === 'number' &&
          x >= maxSlideCoords?.value?.x &&
          y === maxSlideCoords?.value?.y) ||
        (typeof maxSlideCoords?.value?.y === 'number' &&
          y > maxSlideCoords?.value?.y)
      ) {
        return;
      }

      const minXValue = left
        ? 0
        : translateY.value === oppositeY.value
        ? oppositeX.value + dayWidth
        : 0;
      const maxXValue = left
        ? y === oppositeY.value
          ? oppositeX.value - dayWidth
          : dayWidth * 6
        : dayWidth * 6;

      const maxYValue = left ? oppositeY.value : containerHeight - dayHeight;
      const minYValue = left ? 0 : oppositeY.value;

      translateY.value = Math.min(Math.max(y, minYValue), maxYValue);
      translateX.value = Math.min(Math.max(x, minXValue), maxXValue);
    },
    onEnd: () => {
      const { x, y } = countXYWorklet(
        translateX.value,
        translateY.value,
        countValue(translateX.value, dayWidth),
        false,
        dayWidth,
        dayHeight,
      );
      translateX.value = Math.min(Math.max(x, 0), dayWidth * 6);
      translateY.value = Math.min(Math.max(y, 0), containerHeight - dayHeight);
      if (onEnd) {
        runOnJS(onEnd)({ x: translateX.value, y: translateY.value });
      }
    },
  });
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });
  return (
    <PanGestureHandler onGestureEvent={panGestureEvent}>
      <Reanimated.View
        style={[
          styles.main,
          {
            height: dayHeight,
            minWidth: dayWidth,
          },
          rStyle,
        ]}>
        {children}
      </Reanimated.View>
    </PanGestureHandler>
  );
};
