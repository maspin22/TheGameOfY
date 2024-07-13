import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, Button, View, TextInput } from 'react-native';
import { signInWithGoogle } from './SignIn';
import { authentication } from '../database/firebase-config';
import { nanoid } from 'nanoid'; 
import DBAccess from '../database/db_access.js';

const GameLobby = ({ navigation }) => {
  const [gameId, setGameId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [joinGameId, setJoinGameId] = useState('');
  const [userId, setUserId] = useState(nanoid());
  console.log("GameLobby id", userId)
  const dbAccess = new DBAccess(userId);

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

  // Placeholder functions for option handlers
  const handleLocalPlay = () => {
    console.log('Local Play selected');
    // Implementation for Local Play
    navigation.navigate('YGameLocal');
  };

  const handleCreateChallenge = () => {
    handleSignIn(() => {
      console.log('Create Your Own Challenge selected');
      const newGameId = nanoid(7).replace("-", "0").replace("_", "1");
      dbAccess.proposeGame(newGameId);
      setGameId(newGameId); // Assuming you want to update the gameId state here as well
    });
  };

  const handleJoinChallenge = () => {
    if (!joinGameId) {
      alert('Please enter a valid Game ID to join.');
      return;
    }
    console.log('Attempting to join game with ID:', joinGameId);
    dbAccess.proposeGame(joinGameId)
    setGameId(joinGameId); 
  };
  

  // const handleGetMatched = () => {
  //   handleSignIn(() => {
  //     console.log('Get Matched by the Server selected');
  //     askToGetMatched();
  //   });
  // };

  useEffect(() => {
    const unsubscribeAuth = authentication.onAuthStateChanged(user => {
      if (user) {
        // console.log('User signed in:', user.uid);
        // Set user info in state here if necessary
      } else {
        console.log('No user signed in');
      }
    });
  
    const cleanupFunctions = [
      // getMatchedGameId(setGameId),
      dbAccess.hasGameStarted(gameId, setGameStarted, dbAccess.cleanUpWaiting)
    ];
  
    navigation.setOptions({
      headerRight: () => (
        <View style={{ paddingRight: 10 }}>
          <Button onPress={() => handleSignIn(() => {})} title="Sign In" color="#007bff" />
        </View>
      )
    });
  
    if (gameId && gameStarted) {
      navigation.navigate('YGame', { gameId: gameId, userId: dbAccess.getUserId() });
    }

    return () => {
      unsubscribeAuth();
      cleanupFunctions.forEach(cleanup => cleanup && cleanup());
    };
  }, [navigation, gameId, gameStarted]);
  

  return (
    <SafeAreaView style={styles.container}>
      {gameId && <Text style={styles.plainText}>Game ID: {gameId}</Text>}
      {gameId && !gameStarted && <Text style={styles.plainText}>Waiting for a match...</Text>}
      { !gameId ?
        (<><TouchableOpacity style={styles.option} onPress={handleLocalPlay}>
          <Text style={styles.text}>Local Play</Text>
          </TouchableOpacity><TouchableOpacity style={styles.option} onPress={handleCreateChallenge}>
            <Text style={styles.text}>Create Your Own Challenge</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.option} onPress={handleGetMatched}>
            <Text style={styles.text}>Get Matched by the Server</Text>
          </TouchableOpacity> */}
          </>) : <></>
      }
      {console.log("gameId gameStarted:", gameId, gameStarted)}
      { !gameId && (
        <>
          <TextInput
            style={styles.input}
            onChangeText={setJoinGameId}
            value={joinGameId}
            placeholder="Enter Game ID to join"
            returnKeyType="done"
          />
          <Button title="Join Challenge" onPress={handleJoinChallenge} />
        </>
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
  plainText: {
    color: '#000000', // Text color
    fontSize: 16, // Text size
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

