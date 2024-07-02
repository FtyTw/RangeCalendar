import React, { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';
import moment from 'moment';

/*** helpers ***/
import { countStylesConstants } from '../helpers';

/*** types ***/
import { DayCoords } from '../types';
import { useCalendarContext } from '../hooks';

/*** styles ***/
const styles = StyleSheet.create({
  dayWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const Day = ({ day, noDays }: { day: DayCoords; noDays?: boolean }) => {
  const {
    dayTextStyle,
    onDayPress,
    translateXB,
    translateXA,
    translateYB,
    translateYA,
    dayWidth = 40,
    dayHeight,
    dayStyles,
    selectedColor = 'green',
    selectedDayTextColor = 'white',
    inactiveDayTextColor = 'black',
  } = useCalendarContext();
  const pressHandler = () => onDayPress?.(day);
  const backgroundStyles = useAnimatedStyle(() => {
    const {
      isLeftBorder,
      isRightBorder,
      inRange,
      isBetween,
      nextToRange,
      beforeRange,
    } = countStylesConstants(
      dayWidth,
      translateXA.value,
      translateYA.value,
      translateXB.value,
      translateYB.value,
      day.x,
      day.y,
    );
    const beforeRangeWidth =
      translateXA.value % dayWidth
        ? dayWidth - (dayWidth - (translateXA.value % dayWidth))
        : dayWidth;
    const nextToRangeWidth = dayWidth - (translateXB.value % dayWidth);
    const rangeWidth = beforeRange ? beforeRangeWidth : nextToRangeWidth;
    const beforeRangeTranslate =
      translateXA.value % dayWidth
        ? -(dayWidth - (translateXA.value % dayWidth))
        : 0;
    const nextToRangeTranslate = translateXB.value % dayWidth;
    const rangeTranslate = beforeRange
      ? beforeRangeTranslate
      : nextToRangeTranslate;
    const dynamicStyles =
      inRange || isBetween
        ? {
            backgroundColor: selectedColor,
          }
        : {
            backgroundColor:
              isLeftBorder || isRightBorder ? 'transparent' : 'transparent',
          };
    const leftRadius = isLeftBorder ? 30 : 0;
    // || nextToRange
    const rightRadius = isRightBorder ? 30 : 0;
    // || beforeRange
    return {
      borderTopLeftRadius: leftRadius,
      borderBottomLeftRadius: leftRadius,
      borderBottomRightRadius: rightRadius,
      borderTopRightRadius: rightRadius,
      // keep it for multiple period animation
      width: nextToRange || beforeRange ? rangeWidth : dayWidth,
      transform: [
        {
          translateX: nextToRange || beforeRange ? rangeTranslate : 0,
        },
      ],
      ...dynamicStyles,
    };
  }, [translateXA, translateYA, translateXB, translateYB, selectedColor]);

  const textColor = useAnimatedStyle(() => {
    const { isLeftBorder, isRightBorder, inRange, isBetween, almostThere } =
      countStylesConstants(
        dayWidth,
        translateXA.value,
        translateYA.value,
        translateXB.value,
        translateYB.value,
        day.x,
        day.y,
      );
    return {
      color:
        inRange || isBetween || isLeftBorder || isRightBorder || almostThere
          ? selectedDayTextColor
          : inactiveDayTextColor,
    };
  }, [
    translateXA,
    translateYA,
    translateXB,
    translateYB,
    selectedDayTextColor,
    inactiveDayTextColor,
  ]);

  const dateMemo = useMemo(() => {
    return moment(day?.date).format('DD');
  }, [day?.date]);
  return (
    <Pressable
      onPressIn={pressHandler}
      key={day?.date}
      style={[
        styles.dayWrapper,
        {
          width: dayWidth,
          height: dayHeight,
          maxWidth: dayWidth,
          maxHeight: dayHeight,
        },
      ]}>
      <Reanimated.View
        style={[
          {
            position: 'absolute',
            height: dayHeight,
            width: dayWidth,
            maxWidth: dayWidth,
            maxHeight: dayHeight,
          },
          noDays && backgroundStyles,
          dayStyles,
        ]}
      />
      {!noDays && (
        <Reanimated.Text style={[dayTextStyle, textColor]}>
          {dateMemo}
        </Reanimated.Text>
      )}
    </Pressable>
  );
};
