import { Moment } from 'moment/moment';
import { ColorValue, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { ElementType } from 'react';

export interface DayCoords {
  date: string;
  x: number;
  y: number;
}

export interface CalendarContextValues {
  month: Moment;
  dayWidth: number;
  dayHeight: number;
  translateXA: SharedValue<number>;
  translateYB: SharedValue<number>;
  translateYA: SharedValue<number>;
  setMonth: (val: Moment) => void;
  containerStyles?: StyleProp<ViewStyle>;
  headerStyles?: StyleProp<ViewStyle>;
  headerTextStyles?: StyleProp<TextStyle>;
  headerDayTitlesStyles?: StyleProp<ViewStyle>;
  headerDayTitlesTextStyles?: StyleProp<TextStyle>;
  leftSelectionBorderStyles?: StyleProp<ViewStyle>;
  rightSelectionBorderStyles?: StyleProp<ViewStyle>;
  arrowStyles?: StyleProp<ViewStyle>;
  dayStyles?: StyleProp<ViewStyle>;
  dayTextStyle?: StyleProp<TextStyle>;
  onDayPress: (coords: DayCoords, date?: string) => void;
  translateXB: SharedValue<number>;
  selectedColor?: ColorValue;
  selectionColor?: ColorValue;
  selectedDayTextColor?: ColorValue;
  inactiveDayTextColor?: ColorValue;
  selectionBorderStyles?: StyleProp<ViewStyle>;
}

export interface CalendarProps
  extends Pick<
    CalendarContextValues,
    | 'containerStyles'
    | 'headerStyles'
    | 'headerTextStyles'
    | 'dayTextStyle'
    | 'selectedColor'
    | 'selectionColor'
    | 'selectedDayTextColor'
    | 'inactiveDayTextColor'
    | 'leftSelectionBorderStyles'
    | 'rightSelectionBorderStyles'
    | 'dayStyles'
  > {
  dayWidth?: number;
  dayHeight?: number;
  initialDate?: string;
  customDay?: ElementType;
  customHeader?: ElementType;
  onDragEnd?: (days: string[]) => void;
  loadingOnMonthChange?: boolean;
}

export type SatelliteProps = Pick<
  CalendarContextValues,
  'translateYB' | 'translateXA' | 'translateXB' | 'translateYA' | 'dayWidth'
>;

export interface ArrowProps extends Pick<CalendarContextValues, 'arrowStyles'> {
  onPress?: () => void;
  left?: boolean;
}

export interface WeekProps {
  week: DayCoords[];
  dayComponent: ElementType;
  noDays?: boolean;
}

export interface SelectionBorderProps {
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  left?: boolean;
}
