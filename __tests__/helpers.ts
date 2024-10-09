import { expect, test } from '@jest/globals';
import {
  countValue,
  countXYWorklet,
  prepareRange,
  prepareWeeks,
} from '../src/helpers';
import moment from 'moment/moment';
import { MOMENT_FORMAT } from '../src/constants';
import { JULY_2024, WEEKS_JULY_2024 } from '../__mocks__';

test('returns boolean that checks does the range border moved more than 30', () => {
  expect(countValue(60, 40)).toBeTruthy();
});
test('returns boolean that checks does the range border moved less than 30', () => {
  expect(countValue(10, 10)).toBeFalsy();
});

const startOfMonth = moment('2024-07-01').clone().startOf('month');
const endOfMonth = moment('2024-07-31').clone().endOf('month');
test('returns range of dates between startDate and endDate', () => {
  expect(
    prepareRange(
      startOfMonth.format(MOMENT_FORMAT),
      endOfMonth.format(MOMENT_FORMAT),
    ),
  ).toStrictEqual(JULY_2024);
});

test('returns array of arrays with dates included into one or another week', () => {
  expect(prepareWeeks(JULY_2024[0], JULY_2024)).toStrictEqual(WEEKS_JULY_2024);
});

const testObj = { x: 240, y: 320 };
test('returns x | y position of the draggable element within obj {x: number, y: number}', () => {
  expect(countXYWorklet(252, 348)).toEqual(testObj);
});
