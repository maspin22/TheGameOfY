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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
    width: '90%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    color: '#4A148C',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  boardContainer: {
    width: 300,
    height: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 20,
  },
  boardImageWrapper: {
    width: '100%',
    height: '100%',
  },
  boardImage: {
    width: '100%',
    height: '100%',
  },
  pieceImage: {
    width: 20,
    height: 20,
    position: 'absolute',
    borderRadius: 50,
  },
  lastPlayed: {
    shadowColor: '#800080',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 10,
    shadowRadius: 6,
    elevation: 100,
    borderRadius: 50,
  },
});

export default GameBoardContainer;

