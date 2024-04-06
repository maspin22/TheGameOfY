import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithGoogle } from './SignIn';

const GameLobby = ({ navigation }) => {
  // Placeholder functions for option handlers
  const handleLocalPlay = () => {
    console.log('Local Play selected');
    // Implementation for Local Play
    navigation.navigate('YGameLocal');
  };

  const handleCreateChallenge = () => {
    signInWithGoogle().then(() => {
      console.log('Create Your Own Challenge selected');
      navigation.navigate('YGame');
    }).catch((error) => {
      console.error('Failed to sign in with Google:', error);
    });
  };

  const handleGetMatched = () => {
    signInWithGoogle().then(() => {
      console.log('Get Matched by the Server selected');
      // Implementation for getting matched by the server
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.option} onPress={handleLocalPlay}>
        <Text style={styles.text}>Local Play</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleCreateChallenge}>
        <Text style={styles.text}>Create Your Own Challenge</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleGetMatched}>
        <Text style={styles.text}>Get Matched by the Server</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', // Feel free to change the background color
  },
  option: {
    backgroundColor: '#007bff', // Button background color
    padding: 15,
    borderRadius: 5,
    marginBottom: 10, // Spacing between buttons
  },
  text: {
    color: '#ffffff', // Text color
    fontSize: 16, // Text size
  },
});

export default GameLobby;

