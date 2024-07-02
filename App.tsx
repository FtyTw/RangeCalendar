import React from 'react';
import { SafeAreaView, useColorScheme } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Calendar } from './src';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { logInfo } from './src/helpers';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={backgroundStyle}>
        <Calendar
          dayStyles={{ height: 20 }}
          rightSelectionBorderStyles={{
            height: 20,
            borderTopRightRadius: 30,
            borderBottomRightRadius: 30,
          }}
          leftSelectionBorderStyles={{
            height: 20,
            borderBottomLeftRadius: 30,
            borderTopLeftRadius: 30,
          }}
          onDragEnd={logInfo}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default App;
