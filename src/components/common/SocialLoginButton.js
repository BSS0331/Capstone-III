import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const SocialLoginButton = ({ iconSource, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Image source={iconSource} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  icon: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
});

export default SocialLoginButton;
