import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/*** components ***/
import { Arrow } from './Arrow';

/*** helpers ***/
import { DAYS, HEADER_HEIGHT, DAYS_DUMMY_TEMPLATE } from '../constants';

/*** hooks ***/
import { useCalendarContext } from '../hooks';

/*** styles ***/
const styles = StyleSheet.create({
  wrapper: {
    height: HEADER_HEIGHT,
    minHeight: HEADER_HEIGHT,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayTitles: {
    flexDirection: 'row',
  },
});

export const Header = () => {
  const {
    month,
    setMonth,
    headerStyles,
    headerTextStyles,
    headerDayTitlesStyles,
    headerDayTitlesTextStyles,
    arrowStyles,
    dayWidth,
    dayHeight,
  } = useCalendarContext();
  const onMonthFurther = () => {
    setMonth(month.clone().add(1, 'month'));
  };
  const onMonthBefore = () => {
    setMonth(month.clone().subtract(1, 'month'));
  };
  const monthTitle = month.clone().format('MMMM YYYY');
  return (
    <>
      <View style={[styles.wrapper, headerStyles]}>
        <Arrow onPress={onMonthBefore} arrowStyles={arrowStyles} left />
        <Text style={headerTextStyles}>{monthTitle}</Text>
        <Arrow onPress={onMonthFurther} arrowStyles={arrowStyles} />
      </View>
      <View
        style={[
          styles.dayTitles,
          {
            height: dayHeight / 2,
          },
          headerDayTitlesStyles,
        ]}>
        {DAYS_DUMMY_TEMPLATE.map((_d, index) => (
          <View
            key={`header_day_key_${DAYS[index]}`}
            style={[
              styles.textWrapper,
              {
                width: dayWidth,
              },
            ]}>
            <Text style={headerDayTitlesTextStyles}>{DAYS[index]}</Text>
          </View>
        ))}
      </View>
    </>
  );
};
