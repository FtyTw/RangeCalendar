import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import moment, { Moment } from 'moment';
import { last, first, noop } from 'lodash';

/*** components ***/
import { Draggable, Week, Header, SelectionBorder } from './';

/*** helpers **/
import {
  CalendarContext,
  logError,
  prepareRange,
  prepareWeeks,
} from '../helpers';
import { DEFAULT_COORD, MOMENT_FORMAT } from '../constants';

/*** types ***/
import { CalendarProps, DayCoords } from '../types';
import { Day } from './Day';

/*** styles ***/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
  },
  spinner: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: 105,
  },
  hoc: {
    overflow: 'hidden',
  },
});

const setterCurry =
  (values: SharedValue<number>[]) => (coords: number[] | number) =>
    values.forEach(
      (v, index) =>
        (v.value = typeof coords === 'number' ? coords : coords?.[index]),
    );

export const Calendar = ({
  loadingOnMonthChange = true,
  dayWidth = 40,
  dayHeight = 40,
  initialDate = '2023-11-22',
  customDay: CalendarDay = Day,
  customHeader: CalendarHeader = Header,
  containerStyles,
  headerStyles,
  headerTextStyles,
  dayTextStyle,
  selectedColor,
  selectionColor,
  selectedDayTextColor,
  inactiveDayTextColor,
  onDragEnd: onDragEndProp = noop,
  leftSelectionBorderStyles,
  rightSelectionBorderStyles,
  dayStyles,
}: CalendarProps) => {
  const [isLoading, setLoading] = useState<boolean>(loadingOnMonthChange);
  const [month, setMonth] = useState<Moment>(moment(initialDate));
  const daysCoords = useSharedValue<DayCoords[]>([]);
  const monthArr = useSharedValue<DayCoords[][]>([]);
  const translateXA = useSharedValue(DEFAULT_COORD);
  const translateYA = useSharedValue(DEFAULT_COORD);
  const translateXB = useSharedValue(DEFAULT_COORD);
  const translateYB = useSharedValue(DEFAULT_COORD);
  const sinceDate = useSharedValue<DayCoords | undefined>(undefined);
  const tillDate = useSharedValue<DayCoords | undefined>(undefined);
  const containerWidth = dayWidth * 7;
  const containerHeight = dayHeight * 5;

  const setMonthArray = (val: DayCoords[][]) => (monthArr.value = val);
  const setter = setterCurry([
    translateXA,
    translateYA,
    translateXB,
    translateYB,
  ]);

  const onMonthChanged = (
    daysCoordsArg: Required<DayCoords>[],
    selectedMonth?: Moment,
  ) => {
    const aCoords = daysCoordsArg.find(d => d?.date === sinceDate.value?.date);
    const bCoords = daysCoordsArg.find(d => d?.date === tillDate.value?.date);
    const isBetween =
      selectedMonth &&
      selectedMonth.isBefore(tillDate.value?.date) &&
      selectedMonth.isAfter(sinceDate.value?.date);

    if (!daysCoordsArg?.length) {
      return;
    }
    const lastDay = last(daysCoordsArg);
    const firstDay = first(daysCoordsArg);
    if (aCoords && !bCoords && lastDay) {
      const { x, y } = lastDay;
      setter([aCoords.x, aCoords.y, x + dayWidth, y]);
      return true;
    }
    if (bCoords && !aCoords && firstDay) {
      const { x, y } = firstDay;
      setter([x - dayWidth, y, bCoords.x, bCoords.y]);
      return true;
    }
    if (aCoords && bCoords) {
      setter([aCoords.x, aCoords.y, bCoords.x, bCoords.y]);
      return true;
    }
    if (
      sinceDate?.value?.date &&
      tillDate?.value?.date &&
      !aCoords &&
      !bCoords &&
      isBetween
    ) {
      setter([DEFAULT_COORD, 0, containerWidth, containerHeight]);
      return true;
    }
    setter(DEFAULT_COORD);
  };
  const countRange = (date: Moment) => {
    setLoading(true);

    const startOfMonth = date.clone().startOf('month');
    const endOfMonth = date.clone().endOf('month');
    const startOfMonthNum = startOfMonth.day();
    const endOfMonthNum = endOfMonth.day();
    const lackDaysBefore = startOfMonthNum - 1;
    const lackDaysAfter = 7 - endOfMonthNum;
    const firstDay = startOfMonth.clone().subtract(lackDaysBefore, 'day');
    const lastDay = endOfMonth.clone().add(lackDaysAfter, 'day');

    const range = prepareRange(
      firstDay.format(MOMENT_FORMAT),
      lastDay.format(MOMENT_FORMAT),
    );
    const weeks = prepareWeeks(firstDay.format(MOMENT_FORMAT), range);
    const result: DayCoords[][] = Object.keys(weeks).map((i, index) =>
      weeks[i].map((d: string, idx: number) => ({
        date: d,
        y: index * dayHeight,
        x: idx * dayWidth,
      })),
    );

    daysCoords.value = result.flat();

    setMonthArray(result);

    setTimeout(() => onMonthChanged(result.flat(), month), 1300);
    setTimeout(setLoading, 1100, false);
  };
  useEffect(() => {
    countRange(month);
  }, [month]);

  const onDragEnd = () => {
    const beginning = daysCoords?.value.find(
      d => d.x === translateXA.value && d.y === translateYA.value,
    );
    const end = daysCoords?.value.find(
      d => d.x === translateXB.value && d.y === translateYB.value,
    );
    if (beginning) {
      sinceDate.value = beginning;
    }
    if (end) {
      tillDate.value = end;
    }
    const resultValues = [
      beginning?.date ?? sinceDate?.value?.date,
      end?.date ?? tillDate?.value?.date,
    ];

    onDragEndProp?.(resultValues as string[]);
  };

  const onDayPress = (coords: DayCoords) => {
    try {
      const initialX = Math.max(0, coords?.x);
      setter([initialX, coords.y, initialX + dayWidth, coords.y]);
      setTimeout(onDragEnd);
    } catch (e) {
      logError(e);
    }
  };

  const containerDimensions = {
    height: containerHeight,
    width: containerWidth,
  };

  return (
    <View style={[styles.container, containerStyles]}>
      <CalendarContext.Provider
        value={{
          month,
          setMonth,
          headerStyles,
          headerTextStyles,
          dayTextStyle,
          onDayPress,
          translateXB,
          translateXA,
          translateYB,
          translateYA,
          dayWidth,
          dayHeight,
          dayStyles,
          selectedColor,
          selectionColor,
          selectedDayTextColor,
          inactiveDayTextColor,
          leftSelectionBorderStyles,
          rightSelectionBorderStyles,
        }}>
        <CalendarHeader />
        <View>
          {isLoading && (
            <ActivityIndicator
              size="small"
              color="green"
              style={[styles.spinner, containerDimensions]}
            />
          )}
          {[
            <>
              {monthArr?.value?.map((week, index) => (
                <Week
                  dayComponent={CalendarDay}
                  week={week}
                  key={`week_key_${index}`}
                  noDays
                />
              ))}
            </>,
            <>
              <SelectionBorder
                translateX={translateXA}
                translateY={translateYA}
                left
              />
              <SelectionBorder
                translateX={translateXB}
                translateY={translateYB}
              />
            </>,

            <>
              {monthArr?.value?.map((week, index) => (
                <Week
                  dayComponent={CalendarDay}
                  week={week}
                  key={`week_key_${index}`}
                />
              ))}
            </>,
            <>
              <Draggable
                onEnd={onDragEnd}
                oppositeX={translateXB}
                oppositeY={translateYB}
                initialX={translateXA}
                initialY={translateYA}
                left
                dayHeight={dayHeight}
                dayWidth={dayWidth}
                containerHeight={containerHeight}
              />
              <Draggable
                onEnd={onDragEnd}
                oppositeX={translateXA}
                oppositeY={translateYA}
                initialX={translateXB}
                initialY={translateYB}
                dayHeight={dayHeight}
                dayWidth={dayWidth}
                containerHeight={containerHeight}
              />
            </>,
          ].map((children, index) => {
            const zIndex = 100 + index;
            const position = index === 1 ? 'relative' : 'absolute';
            return (
              <View
                key={`main_element_${index}`}
                pointerEvents={'box-none'}
                style={[
                  styles.hoc,
                  {
                    zIndex,
                    position,
                  },
                  containerDimensions,
                ]}>
                {children}
              </View>
            );
          })}
        </View>
      </CalendarContext.Provider>
    </View>
  );
};
