import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/Editor';
import { Text, View } from '../components/Themed';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <EditScreenInfo mode="edit" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
