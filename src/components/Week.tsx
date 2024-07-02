import React from 'react';
import { StyleSheet, View } from 'react-native';

/*** types ***/
import { WeekProps } from '../types';

/*** styles ***/
const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', flex: 1 },
});

export const Week = ({ week, dayComponent: Day, noDays }: WeekProps) => {
  return (
    <View style={styles.wrapper}>
      {week.map(d => (
        <Day day={d} key={`day_of_week_${d?.date}`} noDays={noDays} />
      ))}
    </View>
  );
};
