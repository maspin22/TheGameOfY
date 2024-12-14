import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, Button, View, TextInput } from 'react-native';
import { signInWithGoogle } from './SignIn';
import { authentication } from '../database/firebase-config';
import { nanoid } from 'nanoid'; 
import DBAccess from '../database/db_access.js';
import { Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
      // const link = `http://localhost:19006/${gameId}`; //todo fix for prod
      const link = `https://ygame.io/${gameId}`; //todo fix for prod
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
    <LinearGradient
      colors={['#4A148C', '#7B1FA2', '#9C27B0']}
      style={styles.backgroundGradient}
    >
      <SafeAreaView style={styles.container}>
        {gameId && <Text style={styles.title}>Game ID: {gameId}</Text>}
        {gameId && !gameStarted && <Text style={styles.subtitle}>Waiting for a match...</Text>}
        
        {!gameId ? (
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLocalPlay}>
              <Text style={styles.buttonText}>Local Play</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={handleCreateChallenge}>
              <Text style={styles.buttonText}>Create Your Own Challenge</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        
        {!gameId && (
          <View style={styles.joinContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setJoinGameId}
              value={joinGameId}
              placeholder="Enter Game ID to join"
              placeholderTextColor="rgba(255,255,255,0.6)"
              returnKeyType="done" />
            <TouchableOpacity style={styles.button} onPress={() => handleJoinChallenge()}>
              <Text style={styles.buttonText}>Join Challenge</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {gameId && (
          <TouchableOpacity style={styles.button} onPress={copyJoinLink}>
            <Text style={styles.buttonText}>Copy Join Link</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  backgroundGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '70%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  joinContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
});

export default GameLobby;
