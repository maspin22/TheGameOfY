import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, Button, View, TextInput } from 'react-native';
import { signInWithGoogle } from './SignIn';
import { authentication } from '../database/firebase-config';
import { nanoid } from 'nanoid'; 
import DBAccess from '../database/db_access.js';
import { Linking } from 'react-native';

const GameLobby = ({ navigation }) => {
  const [gameId, setGameId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [joinGameId, setJoinGameId] = useState('');
  const [userId, setUserId] = useState(nanoid());
  console.log("userId", userId);
  const dbAccess = new DBAccess(userId);

  const handleDeepLink = (event) => {
    const url = event.url;
    const gameIdFromUrl = url.replace(/.*?:\/\//g, '').split('/')[1];
    if (gameIdFromUrl) {
      handleJoinChallenge(gameIdFromUrl);
    }
  };

  const handleSignIn = (callback) => {
    if (authentication.currentUser) {
      console.log('Already signed in', authentication.currentUser);
      callback();
    } else {
      signInWithGoogle().then(() => {
        console.log('Signed in successfully!');
        callback();
      }).catch((error) => {
        console.error('Failed to sign in with Google:', error);
      });
    }
  };

  const handleLocalPlay = () => {
    console.log('Local Play selected');
    navigation.navigate('YGameLocal');
  };

  const handleCreateChallenge = () => {
    handleSignIn(() => {
      console.log('Create Your Own Challenge selected');
      const newGameId = nanoid(7).replace("-", "0").replace("_", "1");
      dbAccess.proposeGame(newGameId);
      setGameId(newGameId);
    });
  };

  const handleJoinChallenge = (gameIdToJoin) => {
    const idToJoin = gameIdToJoin || joinGameId;
    if (!idToJoin) {
      alert('Please enter a valid Game ID to join.');
      return;
    }
    console.log('Attempting to join game with ID:', idToJoin);
    dbAccess.proposeGame(idToJoin);
    setGameId(idToJoin);
  };

  const copyJoinLink = () => {
    if (gameId) {
      const link = `http://localhost:19006/${gameId}`; //todo fix for prod
      // const link = `https://ygame.io/${gameId}`; //todo fix for prod
      navigator.clipboard.writeText(link).then(() => {
        alert('Join link copied to clipboard!');
      }).catch((err) => {
        console.error('Could not copy text: ', err);
      });
    } else {
      alert('Create a challenge first to generate a join link.');
    }
  };

  useEffect(() => {
    Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    const cleanupFunctions = [
      dbAccess.hasGameStarted(gameId, setGameStarted, dbAccess.cleanUpWaiting)
    ];

    navigation.setOptions({
      headerRight: () => (
        <View style={{ paddingRight: 10 }}>
          <Button onPress={() => handleSignIn(() => { })} title="Sign In" color="#007bff" />
        </View>
      )
    });

    if (gameId && gameStarted) {
      navigation.navigate('YGame', { gameId: gameId, userId: dbAccess.getUserId() });
    }

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup && cleanup());
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, [navigation, gameId, gameStarted]);

  return (
    <SafeAreaView style={styles.container}>
        {gameId && <Text style={styles.plainText}>Game ID: {gameId}</Text>}
        {gameId && !gameStarted && <Text style={styles.plainText}>Waiting for a match...</Text>}
        {!gameId ? (
          <>
            <TouchableOpacity style={styles.option} onPress={handleLocalPlay}>
              <Text style={styles.text}>Local Play</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={handleCreateChallenge}>
              <Text style={styles.text}>Create Your Own Challenge</Text>
            </TouchableOpacity>
          </>
        ) : null}
        {!gameId && (
          <>
            <TextInput
              style={styles.input}
              onChangeText={setJoinGameId}
              value={joinGameId}
              placeholder="Enter Game ID to join"
              returnKeyType="done" />
            <Button title="Join Challenge" onPress={() => handleJoinChallenge()} />
          </>
        )}
        {gameId && (
          <Button title="Copy Join Link" onPress={copyJoinLink} />
        )}
      </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  option: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
  },
  plainText: {
    color: '#000000',
    fontSize: 16,
  },
  input: {
    width: '70%',
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

export default GameLobby;
