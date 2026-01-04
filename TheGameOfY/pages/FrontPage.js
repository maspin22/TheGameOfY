import React, { useEffect, useRef } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Linking } from 'react-native';

const { width } = Dimensions.get('window');

const FrontPage = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

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
    <View style={styles.backgroundContainer}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          {/* Consolidated Retro Banner */}
          <View style={styles.banner}>
            <Text style={styles.insertCoin}>★ INSERT COIN ★</Text>
            <Text style={styles.gameTitle}>GAME OF Y</Text>
            <Text style={styles.subtitle}>⚔ CONNECT 3 SIDES TO WIN ⚔</Text>
          </View>

          {/* Arcade-style Play Button */}
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => navigation.navigate('GameLobby')}
            activeOpacity={0.8}
          >
            <View style={styles.buttonBorder}>
              <Text style={styles.playButtonText}>▶ PRESS START ◀</Text>
              <Text style={styles.blinkText}>1 PLAYER / 2 PLAYER</Text>
            </View>
          </TouchableOpacity>

          {/* Retro Stats/Features */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>╔════════╗</Text>
              <Text style={styles.statTitle}>QUICK PLAY</Text>
              <Text style={styles.statLabel}>╚════════╝</Text>
              <Text style={styles.statValue}>★★★★★</Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>╔════════╗</Text>
              <Text style={styles.statTitle}>STRATEGY</Text>
              <Text style={styles.statLabel}>╚════════╝</Text>
              <Text style={styles.statValue}>★★★★★</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>╔════════╗</Text>
              <Text style={styles.statTitle}>ONLINE</Text>
              <Text style={styles.statLabel}>╚════════╝</Text>
              <Text style={styles.statValue}>ENABLED</Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>╔════════╗</Text>
              <Text style={styles.statTitle}>LOCAL</Text>
              <Text style={styles.statLabel}>╚════════╝</Text>
              <Text style={styles.statValue}>ENABLED</Text>
            </View>
          </View>

          {/* About Box */}
          <View style={styles.infoBox}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>┌─── ABOUT ───┐</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoText}>
                Y is an abstract strategy game played on a triangular board.
                {'\n\n'}
                Connect all three sides with your pieces to claim victory!
              </Text>
            </View>
            <View style={styles.infoFooter}>
              <Text style={styles.infoTitle}>└──────────────┘</Text>
            </View>
          </View>

          {/* Rules Box */}
          <View style={styles.infoBox}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>┌─ HOW TO PLAY ─┐</Text>
            </View>
            <View style={styles.rulesContent}>
              {[
                '▸ Players take turns placing stones',
                '▸ Connect all three board sides',
                '▸ Corners count for both sides',
                '▸ First to connect wins!',
              ].map((rule, index) => (
                <View key={index} style={styles.ruleRow}>
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
            </View>
            <View style={styles.infoFooter}>
              <Text style={styles.infoTitle}>└──────────────┘</Text>
            </View>
          </View>

          {/* Score Display Style Footer */}
          <View style={styles.footer}>
            <View style={styles.scoreboard}>
              <Text style={styles.scoreText}>━━━━━━━━━━━━━━━━━━━</Text>
              <Text style={styles.footerText}>
                MORE INFO:{' '}
                <Text 
                  style={styles.link}
                  onPress={() => Linking.openURL('https://en.wikipedia.org/wiki/Y_(game)')}
                >
                  WIKIPEDIA
                </Text>
              </Text>
              <Text style={styles.scoreText}>━━━━━━━━━━━━━━━━━━━</Text>
              <Text style={styles.copyright}>© 2026 RETRO GAMES</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a', // Deep black like old CRT screens
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  content: {
    width: '100%',
    maxWidth: 600,
    paddingHorizontal: 20,
  },
  
  // Consolidated Banner
  banner: {
    marginBottom: 25,
    backgroundColor: '#1a1a2e',
    borderWidth: 4,
    borderColor: '#00ff00',
    padding: 20,
    alignItems: 'center',
  },
  insertCoin: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#ffff00',
    marginBottom: 10,
    letterSpacing: 3,
    textShadowColor: '#ffff00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  gameTitle: {
    fontSize: 36,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#00ffff',
    letterSpacing: 6,
    marginVertical: 5,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#ff00ff',
    marginTop: 8,
    letterSpacing: 2,
  },

  // Arcade Button
  playButton: {
    marginBottom: 30,
    borderWidth: 6,
    borderColor: '#ff0000',
    backgroundColor: '#ff0000',
    borderRadius: 0,
  },
  buttonBorder: {
    backgroundColor: '#000000',
    borderWidth: 3,
    borderColor: '#ff0000',
    padding: 20,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#ffff00',
    fontSize: 22,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 3,
    textShadowColor: '#ffff00',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  blinkText: {
    color: '#00ff00',
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 8,
    letterSpacing: 2,
  },

  // Stats Grid
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#1a1a2e',
    borderWidth: 3,
    borderColor: '#00ffff',
    padding: 15,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#00ffff',
    letterSpacing: 1,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 5,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#ffff00',
    marginTop: 5,
    letterSpacing: 1,
  },

  // Info Boxes
  infoBox: {
    marginBottom: 20,
    backgroundColor: '#1a1a2e',
    borderWidth: 4,
    borderColor: '#ff00ff',
  },
  infoHeader: {
    backgroundColor: '#ff00ff',
    padding: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  infoContent: {
    padding: 20,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#00ff00',
    lineHeight: 22,
    letterSpacing: 1,
  },
  infoFooter: {
    padding: 4,
  },

  // Rules
  rulesContent: {
    padding: 20,
  },
  ruleRow: {
    marginBottom: 12,
  },
  ruleText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#00ff00',
    lineHeight: 22,
    letterSpacing: 1,
  },

  // Footer Scoreboard
  footer: {
    marginTop: 30,
    marginBottom: 20,
  },
  scoreboard: {
    backgroundColor: '#000000',
    borderWidth: 4,
    borderColor: '#ffff00',
    padding: 20,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#ffff00',
    letterSpacing: 1,
    marginVertical: 5,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#00ffff',
    textAlign: 'center',
    marginVertical: 10,
    letterSpacing: 1,
  },
  link: {
    color: '#ff00ff',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    letterSpacing: 2,
  },
  copyright: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#888888',
    marginTop: 10,
    letterSpacing: 2,
  },
});

export default FrontPage;
