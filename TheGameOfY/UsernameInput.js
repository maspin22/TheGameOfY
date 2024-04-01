import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const UsernameInput = ({ handleSaveUsername, handleSaveGameId }) => {
  const [username, setUsername] = useState('');
  const [gameId, setGameId] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="Enter your username"
        onSubmitEditing={() => handleSaveUsername(username)} // This will be triggered when Enter key is pressed
        returnKeyType="done" // Optional: Changes the return key to indicate "done"
      />
      <TextInput
        style={styles.input}
        onChangeText={setGameId}
        value={gameId}
        placeholder="Enter a Game ID"
        onSubmitEditing={() => handleSaveGameId(gameId)} // This will be triggered when Enter key is pressed
        returnKeyType="done" // Optional: Changes the return key to indicate "done"
      />
      {console.log(username)}
      {console.log(gameId)}

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
});

export default UsernameInput;
