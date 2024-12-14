import React, { useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FrontPage = ({ navigation }) => {
  const handleDeepLink = (event) => {
    const url = event.url;
    const gameId = url.replace(/.*?:\/\//g, '').split('/')[1];
    if (gameId) {
      navigation.navigate('GameLobby', { screen: 'GameLobby', params: { gameId } });
      window.history.replaceState(null, '', '/');
      console.log("cleaning up url")
    }
  };
  
  useEffect(() => {
    Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });
    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  return (
    <LinearGradient
      colors={['#4A148C', '#7B1FA2', '#9C27B0']}
      style={styles.backgroundGradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>The Game of Y</Text>
          <View style={styles.divider} />
          
          <Text style={styles.subtitle}>
            Connect the Dots, Shape Your Strategy
          </Text>

          <View style={styles.card}>
            <Text style={styles.description}>
              Y is an elegant abstract strategy game played on a triangular board. 
              Connect all three sides of the board with your pieces to claim victory 
              in this beautifully simple yet deeply strategic game.
            </Text>
          </View>

          <View style={styles.rulesCard}>
            <Text style={styles.rulesTitle}>How to Play</Text>
            <Text style={styles.rules}>
              • Players take turns placing stones on the board{"\n"}
              • Connect all three sides to win{"\n"}
              • Corners count for both adjacent sides{"\n"}
              • First to create a continuous path wins
            </Text>
          </View>

          <TouchableOpacity
            style={styles.playButton}
            onPress={() => navigation.navigate('GameLobby')}
          >
            <Text style={styles.playButtonText}>PLAY NOW</Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            Learn more about the game on{' '}
            <Text 
              style={styles.link}
              onPress={() => Linking.openURL('https://en.wikipedia.org/wiki/Y_(game)')}
            >
              Wikipedia
            </Text>
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 600,
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  divider: {
    height: 3,
    width: 60,
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  description: {
    fontSize: 16,
    color: '#4A148C',
    lineHeight: 24,
    textAlign: 'center',
  },
  rulesCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rulesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 10,
    textAlign: 'center',
  },
  rules: {
    fontSize: 16,
    color: '#4A148C',
    lineHeight: 24,
  },
  playButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playButtonText: {
    color: '#4A148C',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  note: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  link: {
    color: '#ffffff',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

export default FrontPage;
