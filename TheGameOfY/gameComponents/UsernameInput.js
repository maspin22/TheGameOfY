import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

const UsernameInput = ({ handleSaveUsername, handleSaveGameId }) => {
  const [username, setUsername] = useState('');
  const [gameId, setGameId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Function to handle the submission
  const handleSubmit = () => {
    handleSaveUsername(username);
    handleSaveGameId(gameId);
    setSubmitted(true); // Mark as submitted to show the waiting message
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="Enter your username"
        returnKeyType="done"
      />
      <TextInput
        style={styles.input}
        onChangeText={setGameId}
        value={gameId}
        placeholder="Enter a Game ID"
        returnKeyType="done"
      />
      <Button
        title="Submit"
        onPress={handleSubmit}
      />
      {submitted && <Text style={styles.waitingText}>Waiting for player two...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    width: '100%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  waitingText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default UsernameInput;