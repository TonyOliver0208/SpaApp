import React from 'react';
import {TextInput as RNTextInput, StyleSheet} from 'react-native';

import {View} from './View';
import {Icon} from './Icon';
import {Button} from './Button';
import {Colors} from '../config';

export const TextInput = ({
  width = '100%',
  leftIconName,
  rightIcon,
  handlePasswordVisibility,
  ...otherProps
}) => {
  return (
    <View style={[styles.container, {width}]}>
      {leftIconName ? (
        <View style={styles.iconContainer}>
          <Icon name={leftIconName} size={22} color={Colors.mediumGray} />
        </View>
      ) : null}
      <RNTextInput
        style={styles.input}
        placeholderTextColor={Colors.mediumGray}
        {...otherProps}
      />
      {rightIcon ? (
        <View style={styles.iconContainer}>
          <Button onPress={handlePasswordVisibility}>
            <Icon name={rightIcon} size={22} color={Colors.mediumGray} />
          </Button>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center', // This will vertically center the children
    borderWidth: 1,
    borderColor: Colors.mediumGray,
    marginVertical: 12,
    paddingVertical: 10,
  },
  iconContainer: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: Colors.black,
    paddingVertical: 12, // To match the icon container's padding
  },
});
