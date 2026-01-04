import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { boardConst } from './GameBoard';

// ADJUST THESE VALUES TO CENTER PIECES ON VERTICES
const PIECE_OFFSET_X = -4;  // Horizontal offset (negative moves left)
const PIECE_OFFSET_Y = 1;  // Vertical offset (negative moves up)

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
  // Determine which piece was last played by comparing array lengths
  // The most recently added piece is in whichever array is longer, or if equal, in pieces2
  let lastPieceId = null;
  let isLastPiecePlayer1 = false;
  
  if (pieces && pieces2) {
    const pieces1Length = pieces.length || 0;
    const pieces2Length = pieces2.length || 0;
    
    if (pieces1Length > pieces2Length && pieces1Length > 0) {
      lastPieceId = pieces[pieces1Length - 1];
      isLastPiecePlayer1 = true;
    } else if (pieces2Length > 0) {
      lastPieceId = pieces2[pieces2Length - 1];
      isLastPiecePlayer1 = false;
    }
  }

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
              {
                left: boardConst[piece].position.left + PIECE_OFFSET_X,
                top: boardConst[piece].position.top + PIECE_OFFSET_Y,
              },
              (showLastPlayed && piece === lastPieceId) 
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
              {
                left: boardConst[piece].position.left + PIECE_OFFSET_X,
                top: boardConst[piece].position.top + PIECE_OFFSET_Y,
              },
              (showLastPlayed && piece === lastPieceId) 
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
    overflow: 'visible', // Changed to visible so glow can show
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
    borderRadius: 10, // Make circular
  },
  lastPlayed: {
    borderWidth: 2,
    borderColor: '#00ffff', // Cyan - neutral and matches the retro theme
    backgroundColor: 'transparent',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 50,
  },
});

export default GameBoardContainer;

