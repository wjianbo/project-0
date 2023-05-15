import { StyleSheet, View, Pressable, Text, GestureResponderEvent } from 'react-native';
import { MonoText } from './StyledText';
import Colors from '../constants/Colors';

interface Props {
  item: any,
  action: any
}
export default function Link(props: Props) {
  const { item, action } = props;
  const onPress = () => {
    action(item)
  };
  function handleLongPress(event: GestureResponderEvent): void {
    alert('long press');
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}
        onLongPress={handleLongPress}>
        <MonoText style={styles.buttonLabel}
          lightColor={Colors.light.tint}>{item.name}</MonoText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
  },
  button: {
    borderRadius: 10,
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
});
