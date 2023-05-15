import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/Viewer';
import { View } from '../components/Themed';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <EditScreenInfo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
