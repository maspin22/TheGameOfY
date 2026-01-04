import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, View, TextInput } from 'react-native';
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

    if (gameId && gameStarted) {
      navigation.navigate('YGame', { gameId: gameId, userId: dbAccess.getUserId() });
    }

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup && cleanup());
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, [navigation, gameId, gameStarted]);

  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.container}>
        {/* Retro Navigation Banner */}
        <View style={styles.navBanner}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>◄ BACK</Text>
          </TouchableOpacity>
          
          <View style={styles.navTitle}>
            <Text style={styles.navTitleText}>GAME LOBBY</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.signInButton}
            onPress={() => handleSignIn(() => { })}
          >
            <Text style={styles.signInButtonText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>

        {/* Game Status Display */}
        {gameId && (
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>╔═══ GAME STATUS ═══╗</Text>
            <Text style={styles.gameIdText}>ID: {gameId}</Text>
            {!gameStarted && (
              <Text style={styles.waitingText}>⟳ WAITING FOR OPPONENT...</Text>
            )}
            <Text style={styles.statusLabel}>╚═══════════════════╝</Text>
          </View>
        )}
        
        {!gameId ? (
          <View style={styles.optionsContainer}>
            <Text style={styles.selectModeText}>┌─ SELECT MODE ─┐</Text>
            
            <TouchableOpacity style={styles.button} onPress={handleLocalPlay}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>🎮</Text>
                <Text style={styles.buttonText}>LOCAL PLAY</Text>
                <Text style={styles.buttonSubtext}>2 Players • Same Device</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={handleCreateChallenge}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>🌐</Text>
                <Text style={styles.buttonText}>CREATE CHALLENGE</Text>
                <Text style={styles.buttonSubtext}>Online • Get Link</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider}>
              <Text style={styles.dividerText}>─── OR ───</Text>
            </View>

            <View style={styles.joinBox}>
              <Text style={styles.joinLabel}>JOIN EXISTING GAME:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setJoinGameId}
                value={joinGameId}
                placeholder="ENTER GAME ID"
                placeholderTextColor="#00ff00"
              />
              <TouchableOpacity 
                style={[styles.button, styles.joinButton]} 
                onPress={() => handleJoinChallenge()}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>► JOIN GAME</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        
        {gameId && (
          <TouchableOpacity style={styles.copyButton} onPress={copyJoinLink}>
            <Text style={styles.copyButtonText}>📋 COPY INVITE LINK</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  
  // Navigation Banner
  navBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderWidth: 4,
    borderColor: '#00ff00',
    padding: 15,
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 10,
  },
  backButtonText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#ffff00',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  navTitle: {
    flex: 1,
    alignItems: 'center',
  },
  navTitleText: {
    fontFamily: 'monospace',
    fontSize: 18,
    color: '#00ffff',
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  signInButton: {
    backgroundColor: '#ff00ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  signInButtonText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Status Box
  statusBox: {
    backgroundColor: '#1a1a2e',
    borderWidth: 4,
    borderColor: '#ffff00',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusLabel: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#ffff00',
    letterSpacing: 1,
    marginVertical: 5,
  },
  gameIdText: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: '#00ffff',
    fontWeight: 'bold',
    letterSpacing: 3,
    marginVertical: 10,
  },
  waitingText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#00ff00',
    letterSpacing: 2,
    marginVertical: 10,
  },

  // Options Container
  optionsContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  selectModeText: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#00ffff',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 2,
  },

  // Buttons
  button: {
    backgroundColor: '#1a1a2e',
    borderWidth: 4,
    borderColor: '#00ff00',
    marginVertical: 10,
    overflow: 'hidden',
  },
  buttonContent: {
    padding: 20,
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  buttonText: {
    fontFamily: 'monospace',
    fontSize: 18,
    color: '#00ffff',
    fontWeight: 'bold',
    letterSpacing: 3,
    textAlign: 'center',
  },
  buttonSubtext: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#00ff00',
    letterSpacing: 1,
    marginTop: 5,
  },

  // Divider
  divider: {
    marginVertical: 20,
    alignItems: 'center',
  },
  dividerText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#888888',
    letterSpacing: 2,
  },

  // Join Box
  joinBox: {
    backgroundColor: '#1a1a2e',
    borderWidth: 4,
    borderColor: '#ff00ff',
    padding: 20,
    marginTop: 10,
  },
  joinLabel: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#ff00ff',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#000000',
    borderWidth: 3,
    borderColor: '#00ff00',
    color: '#00ff00',
    fontFamily: 'monospace',
    fontSize: 16,
    padding: 15,
    marginBottom: 15,
    letterSpacing: 2,
    textAlign: 'center',
  },
  joinButton: {
    borderColor: '#ff00ff',
    marginVertical: 0,
  },

  // Copy Button
  copyButton: {
    backgroundColor: '#1a1a2e',
    borderWidth: 4,
    borderColor: '#ffff00',
    padding: 20,
    marginTop: 20,
    alignSelf: 'center',
    width: '90%',
    maxWidth: 400,
  },
  copyButtonText: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#ffff00',
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
});

export default GameLobby;
