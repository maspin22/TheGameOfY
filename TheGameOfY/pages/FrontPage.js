import React from 'react';
import { ScrollView, View, Text, Button, StyleSheet } from 'react-native';

const FrontPage = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to the Y Game</Text>
      <Text style={styles.description}>
        Y is an abstract strategy board game known for its strategic play. 
        It's played on a triangular board with hexagonal spaces. The objective 
        is to connect all three sides of the board with your pieces.
      </Text>
      <Text style={styles.rulesTitle}>Rules:</Text>
      <Text style={styles.rules}>
        1. Players take turns placing one stone of their color on the board.{"\n"}
        2. The first player to connect all three sides (with a continuous string of pieces) wins.{"\n"}
        3. The corner's count as the two sides it coonects. 
      </Text>
      <Text style={styles.note}>
        Y is praised for its simplicity and complexity. Learn more @ 
        <a href="https://en.wikipedia.org/wiki/Y_(game)" rel="noreferrer"> Wiki </a>        
      </Text>
      <Button
        title="Go to Lobby"
        onPress={() => navigation.navigate('GameLobby')}
        color="#007bff"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  rulesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  rules: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 10,
  },
  note: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default FrontPage;
