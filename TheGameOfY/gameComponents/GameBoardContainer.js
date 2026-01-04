import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { boardConst } from './GameBoard';

const GameBoardContainer = ({ 
  boardRef, 
  onBoardPress, 
  pieces, 
  pieces2, 
  playerTurnText, 
  actionButtonText, 
  onActionButtonPress,
  winner,
  winnerText,
  lastPlayedIndex,
  showLastPlayed = true,
}) => {
  return (
    <>
      {winner && (
        <View style={styles.card}>
          <Text style={styles.cardText}>{winnerText}</Text>
        </View>
      )}
      
      <View style={styles.card}>
        <Text style={styles.cardText}>{playerTurnText}</Text>
      </View>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={onActionButtonPress}
      >
        <Text style={styles.actionButtonText}>{actionButtonText}</Text>
      </TouchableOpacity>

      <View ref={boardRef} style={styles.boardContainer}>
        <TouchableOpacity onPress={onBoardPress} style={styles.boardImageWrapper}>
          <Image 
            source={require('../assets/Game_of_Y_Mask_Board.svg')} 
            style={styles.boardImage} 
          />
        </TouchableOpacity>
        
        {Array.isArray(pieces) && pieces.map((piece, index) => (
          <Image
            key={`piece1-${piece}-${index}`}
            source={require('../assets/whiteStone.png')}
            style={[
              styles.pieceImage, 
              boardConst[piece].position,
              (showLastPlayed && lastPlayedIndex !== null && lastPlayedIndex === index) 
                ? styles.lastPlayed 
                : null,
            ]}
          />
        ))}

        {Array.isArray(pieces2) && pieces2.map((piece, index) => (
          <Image
            key={`piece2-${piece}-${index}`}
            source={require('../assets/blackStone.png')}
            style={[
              styles.pieceImage, 
              boardConst[piece].position,
              (showLastPlayed && lastPlayedIndex !== null && lastPlayedIndex === index) 
                ? styles.lastPlayed 
                : null,
            ]}
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderWidth: 4,
    borderColor: '#00ffff',
    padding: 15,
    width: '90%',
    marginBottom: 15,
    alignSelf: 'center',
  },
  cardText: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#00ffff',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  actionButton: {
    backgroundColor: '#1a1a2e',
    borderWidth: 4,
    borderColor: '#ff0000',
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginVertical: 10,
    alignSelf: 'center',
  },
  actionButtonText: {
    fontFamily: 'monospace',
    color: '#ffff00',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 3,
    textAlign: 'center',
  },
  boardContainer: {
    width: 300,
    height: 300,
    backgroundColor: '#1a1a2e',
    borderWidth: 4,
    borderColor: '#00ff00',
    overflow: 'hidden',
    marginTop: 20,
    alignSelf: 'center',
  },
  boardImageWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f9f9f9',
  },
  boardImage: {
    width: '100%',
    height: '100%',
  },
  pieceImage: {
    width: 20,
    height: 20,
    position: 'absolute',
  },
  lastPlayed: {
    shadowColor: '#ffff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 100,
  },
});

export default GameBoardContainer;

