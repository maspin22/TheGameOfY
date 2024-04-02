import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Get the screen width

const GameOverBanner = ({ winner, player }) => {
  if ( winner === null ){
    throw Error("winner required")
  }
  const message = winner === player ? `Congratulations, you won!}` : `Game Over! The other player won`;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: width - 40, // Subtract some value to account for padding/margin
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -(width / 2) + 20 }, { translateY: -50 }], // Adjust based on the banner's width
    backgroundColor: '#f44336',
    padding: 20,
    borderRadius: 10,
    elevation: 20, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameOverBanner;
