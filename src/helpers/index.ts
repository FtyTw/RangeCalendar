import { createContext } from 'react';
import moment from 'moment';

import { CalendarContextValues } from '../types';
import { MOMENT_FORMAT } from '../constants';

export const CalendarContext = createContext<CalendarContextValues>({
  dayHeight: 40,
  dayWidth: 40,
} as CalendarContextValues);

export const prepareRange = (start: string = '', end: string = '') => {
  const isBefore = moment(end).isBefore(moment(start));
  const initDates = [
    moment(start?.split('T')?.[0]),
    moment(end?.split('T')?.[0]),
  ];
  if (isBefore) {
    initDates.reverse();
  }

  const startDate = initDates[0];
  const endDate = initDates[1];

  const now = startDate.clone();
  const dates = [];

  while (now.isSameOrBefore(endDate)) {
    dates.push(now.format(MOMENT_FORMAT));
    now.add(1, 'days');
  }
  return dates;
};

export const prepareWeeks = <T>(date: T, input: T[]) => {
  const array = [...input];
  const weeks: any = [];
  while (array.length) {
    const initial = array.splice(0, 7);
    weeks.push(initial);
  }
  return weeks;
};

export const countValue = (val: number, dim: number) => {
  'worklet';
  return ((val / dim) * 100) % 100 > 30;
};

export const countXYWorklet = (
  x: number = 0,
  y: number = 0,
  ceilX?: boolean,
  ceilY?: boolean,
  dayWidth: number = 40,
  dayHeight: number = 40,
) => {
  'worklet';
  return {
    x: Math[ceilX ? 'ceil' : 'floor'](x / dayWidth) * dayWidth,
    y: Math[ceilY ? 'ceil' : 'floor'](y / dayHeight) * dayHeight,
  };
};

export const countStylesConstants = (...args: number[]) => {
  'worklet';
  if (args.every(v => typeof v === 'number')) {
    const [dayWidth, XA, YA, XB, YB, X, Y] = args;
    const sameY = YA === YB;
    const isLeftBorder = X === XA && Y === YA;
    const isRightBorder = X === XB && Y === YB;
    const inRange = sameY
      ? X > XA && X < XB && Y === YA
      : (X > XA && Y === YA) || (X < XB && Y === YB);
    const isBetween = Y > YA && Y < YB;
    const nextToRange = X >= XB && X <= XB + dayWidth && Y === YB;
    const beforeRange = X < XA && X >= XA - dayWidth && Y === YA;
    const equalY = YA === Y || YB === Y;
    const almostThere =
      (XB > 0 &&
        Y === YB &&
        XB + (dayWidth / 3) * 2 >= X &&
        XB < X + dayWidth) ||
      (XA > 0 && Y === YA && XA - (dayWidth / 3) * 2 <= X && XA > X - dayWidth);

    return {
      isLeftBorder,
      isRightBorder,
      inRange,
      isBetween,
      nextToRange,
      beforeRange,
      equalY,
      almostThere,
    };
  }
  return {};
};

export const logError = (errorMessage: any) =>
  // eslint-disable-next-line no-console
  __DEV__ && console.error(errorMessage);

export const logInfo = (logData: any) =>
  // eslint-disable-next-line no-console
  __DEV__ && console.info(logData);
